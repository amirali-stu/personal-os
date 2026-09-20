import type { MarketAsset } from "../types";

const API_BASE_URL = import.meta.env.VITE_MARKET_API_URL || "";

type MarketApiResponse = {
  assets?: MarketAsset[];
};

export async function fetchMarketAssets(): Promise<MarketAsset[]> {
  if (!API_BASE_URL) {
    throw new Error("آدرس API بازار تنظیم نشده است.");
  }

  const response = await fetch(`${API_BASE_URL}/markets`, {
    method: "GET",
    headers: {
      Accept: "application/json",
    },
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(`خطا در دریافت اطلاعات بازار (${response.status})`);
  }

  const data: MarketApiResponse = await response.json();

  if (!Array.isArray(data.assets)) {
    throw new Error("ساختار پاسخ API بازار معتبر نیست.");
  }

  return data.assets;
}
