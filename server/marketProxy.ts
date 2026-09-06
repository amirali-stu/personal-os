import express from "express";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config({
  path: ".env.server",
});

const app = express();

app.use(cors());

const PORT = 3001;

const NAVASAN_API_KEY = process.env.NAVASAN_API_KEY;

if (!NAVASAN_API_KEY) {
  throw new Error("NAVASAN_API_KEY در .env.server تنظیم نشده است.");
}

type NavasanItem = {
  value: string | number;
  change?: string | number;
  timestamp?: number;
  date?: string;
};

type NavasanResponse = Record<string, NavasanItem>;

type MarketItemKey = "usd_sell" | "eur" | "18ayar";

async function fetchNavasanItem(
  item: MarketItemKey,
): Promise<NavasanItem | null> {
  const url =
    `http://api.navasan.tech/latest/` +
    `?api_key=${encodeURIComponent(NAVASAN_API_KEY)}` +
    `&item=${encodeURIComponent(item)}`;

  const response = await fetch(url, {
    method: "GET",
    cache: "no-store",
  });

  if (response.status === 429) {
    console.warn(`Navasan rate limit reached for ${item}.`);

    return null;
  }

  if (!response.ok) {
    console.error(
      `Navasan request failed for ${item}:`,
      response.status,
      response.statusText,
    );

    return null;
  }

  const data = (await response.json()) as NavasanResponse;

  return data[item] ?? null;
}

function toNumber(value: unknown): number {
  const number = Number(value);

  return Number.isFinite(number) ? number : 0;
}

function calculateChangePercent(item: NavasanItem): number {
  const value = toNumber(item.value);
  const change = toNumber(item.change);

  if (!value || !change) {
    return 0;
  }

  const previousValue = value - change;

  if (!previousValue) {
    return 0;
  }

  return (change / previousValue) * 100;
}

let cachedResponse: {
  assets: Array<{
    id: string;
    symbol: string;
    name: string;
    type: "forex" | "gold" | "currency";
    price: number;
    change24h: number;
    high24h: number;
    low24h: number;
    unit: string;
    updatedAt: number;
  }>;
  updatedAt: number;
} | null = null;

let lastSuccessfulFetch = 0;

const CACHE_DURATION = 2 * 60 * 1000;

let requestInProgress: Promise<typeof cachedResponse> | null = null;

async function loadMarkets() {
  const now = Date.now();

  if (cachedResponse && now - lastSuccessfulFetch < CACHE_DURATION) {
    return cachedResponse;
  }

  if (requestInProgress) {
    return requestInProgress;
  }

  requestInProgress = (async () => {
    try {
      const [usd, eur, gold] = await Promise.all([
        fetchNavasanItem("usd_sell"),
        fetchNavasanItem("eur"),
        fetchNavasanItem("18ayar"),
      ]);

      /*
       * اگر Navasan به دلیل 429 پاسخ نداد،
       * داده قبلی را نگه می‌داریم.
       */
      if (!usd || !eur || !gold) {
        if (cachedResponse) {
          console.warn(
            "Using cached market response because Navasan did not return all required data.",
          );

          return cachedResponse;
        }

        throw new Error("اطلاعات مورد نیاز بازار در پاسخ API وجود ندارد.");
      }

      const usdPrice = toNumber(usd.value);

      const eurPrice = toNumber(eur.value);

      const goldPrice = toNumber(gold.value);

      if (!usdPrice || !eurPrice || !goldPrice) {
        if (cachedResponse) {
          return cachedResponse;
        }

        throw new Error("قیمت دریافت‌شده از Navasan معتبر نیست.");
      }

      const eurUsd = eurPrice / usdPrice;

      const updatedAt =
        Math.max(
          toNumber(usd.timestamp),
          toNumber(eur.timestamp),
          toNumber(gold.timestamp),
        ) * 1000;

      /*
       * فعلاً high / low را از latest
       * نمی‌سازیم تا برای هر refresh
       * درخواست OHLC جداگانه نزنیم.
       *
       * بعداً تاریخچه واقعی را جداگانه
       * اضافه می‌کنیم.
       */
      const assets = [
        {
          id: "eur-usd",
          symbol: "EUR/USD",
          name: "یورو / دلار",
          type: "forex" as const,
          price: Number(eurUsd.toFixed(4)),
          change24h: calculateChangePercent(eur),
          high24h: Number(eurUsd.toFixed(4)),
          low24h: Number(eurUsd.toFixed(4)),
          unit: "دلار",
          updatedAt:
            toNumber(eur.timestamp) > 0
              ? toNumber(eur.timestamp) * 1000
              : updatedAt,
        },

        {
          id: "gold-18",
          symbol: "GOLD 18K",
          name: "طلای ۱۸ عیار",
          type: "gold" as const,
          price: Math.round(goldPrice),
          change24h: calculateChangePercent(gold),
          high24h: Math.round(goldPrice),
          low24h: Math.round(goldPrice),
          unit: "تومان / گرم",
          updatedAt:
            toNumber(gold.timestamp) > 0
              ? toNumber(gold.timestamp) * 1000
              : updatedAt,
        },

        {
          id: "usd-irr",
          symbol: "USD/IRR",
          name: "دلار آزاد",
          type: "currency" as const,
          price: Math.round(usdPrice),
          change24h: calculateChangePercent(usd),
          high24h: Math.round(usdPrice),
          low24h: Math.round(usdPrice),
          unit: "تومان",
          updatedAt:
            toNumber(usd.timestamp) > 0
              ? toNumber(usd.timestamp) * 1000
              : updatedAt,
        },
      ];

      cachedResponse = {
        assets,
        updatedAt,
      };

      lastSuccessfulFetch = Date.now();

      return cachedResponse;
    } finally {
      requestInProgress = null;
    }
  })();

  return requestInProgress;
}

app.get("/api/markets", async (_req, res) => {
  try {
    const data = await loadMarkets();

    return res.json(data);
  } catch (error) {
    console.error("Market proxy error:", error);

    if (cachedResponse) {
      return res.json(cachedResponse);
    }

    return res.status(502).json({
      message: "اطلاعات بازار در دسترس نیست.",
    });
  }
});

app.listen(PORT, () => {
  console.log(`Market proxy running on http://localhost:${PORT}`);
});
