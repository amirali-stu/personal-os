import {
  ArrowLeft,
  ArrowRight,
  BarChart3,
  CheckCircle2,
  Flame,
  Goal,
  Heart,
  LineChart,
  RotateCcw,
  ShieldCheck,
  Sparkles,
  Target,
  Trophy,
  Zap,
} from "lucide-react";

import { useEffect, useMemo, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import { useSettingsStore } from "../../app/store/settingsStore";
import { useTasks } from "../tasks/hooks/useTasks";
import { useTrades } from "../trading/hooks/useTrades";

const VISION_MUSIC_SRC = "/vision-music.mp3";

const visionGoals = [
  {
    id: "car",
    title: "ماشینی که می‌خواهم",
    caption: "نه برای پز دادن؛ برای حس آزادی و نتیجهٔ سال‌ها نظم",
    src: "/images/250.jpg",
  },
  {
    id: "success",
    title: "کنار افراد موفق",
    caption: "محیطی که فکر و استانداردت را بالا می‌کشد",
    src: "/images/success.webp",
  },
  {
    id: "peace",
    title: "آرامش محض",
    caption: "جایی که دیگر مجبور نیستم برای بقا بجنگم",
    src: "/images/peace.jpg",
  },
  {
    id: "freedom",
    title: "آزادی واقعی",
    caption: "زمان و انتخاب؛ نه اسارت در ساعت و اجبار",
    src: "/images/freedom.jpg",
  },
];

const motivationMessages = [
  {
    title: "لازم نیست امروز همه‌چیز را درست کنی.",
    text: "فقط کاری را انجام بده که نسخه‌ی فردای تو از نسخه‌ی امروزت انتظار دارد.",
  },
  {
    title: "قرار نیست مسیر آسان باشد.",
    text: "قرار است آن‌قدر ادامه بدهی که یک روز به عقب نگاه کنی و ببینی چقدر تغییر کرده‌ای.",
  },
  {
    title: "یک معامله تو را تریدر نمی‌کند.",
    text: "هزاران تصمیم کوچک، ثبت اشتباهات، نظم و تکرار است که از تو یک تریدر می‌سازد.",
  },
  {
    title: "وقتی انگیزه نداری، به سیستم تکیه کن.",
    text: "قرار نیست همیشه باانگیزه باشی. قرار است حتی در روزهای بی‌انگیزگی هم مسیرت را رها نکنی.",
  },
  {
    title: "نسخه‌ای که می‌خواهی بشوی، همین امروز ساخته می‌شود.",
    text: "نه فردا، نه وقتی پول بیشتری داشتی، نه وقتی همه‌چیز کامل شد.",
  },
];

const journeySteps = [
  {
    number: "01",
    icon: Sparkles,
    title: "یادگیری",
    description:
      "بازار را بفهم. اقتصاد، ساختار قیمت، نقدینگی، ریسک و روان‌شناسی معامله‌گری را یاد بگیر.",
  },
  {
    number: "02",
    icon: Target,
    title: "نظم",
    description:
      "هر چیزی که یاد می‌گیری باید تبدیل به یک قانون قابل اجرا شود؛ نه یک تصمیم لحظه‌ای.",
  },
  {
    number: "03",
    icon: LineChart,
    title: "ثبت",
    description:
      "هر معامله را ثبت کن. دلیل ورود، نتیجه، اشتباه و چیزی که باید دفعه‌ی بعد بهتر انجام بدهی.",
  },
  {
    number: "04",
    icon: ShieldCheck,
    title: "کنترل",
    description:
      "هدف فقط سود کردن نیست؛ هدف این است که بتوانی در شرایط سخت، طبق سیستم خودت تصمیم بگیری.",
  },
  {
    number: "05",
    icon: Trophy,
    title: "ثبات",
    description:
      "موفقیت واقعی زمانی شروع می‌شود که عملکرد خوب تو تبدیل به یک رفتار تکرارپذیر شود.",
  },
];

function formatNumber(value: number, locale: string) {
  return new Intl.NumberFormat(locale).format(value);
}

function formatResult(value: number, locale: string) {
  const formatted = new Intl.NumberFormat(locale, {
    maximumFractionDigits: 2,
  }).format(Math.abs(value));

  if (value > 0) return `+${formatted}`;
  if (value < 0) return `-${formatted}`;

  return "0";
}

export function MotivationPage() {
  const navigate = useNavigate();
  const language = useSettingsStore((state) => state.language);
  const isRtl = language === "fa";
  const locale = isRtl ? "fa-IR" : "en-US";

  const { trades, totalResult, successfulTrades } = useTrades();
  const { completedCount, totalCount, progress } = useTasks();

  const dailyMessage = useMemo(() => {
    const day = new Date().getDate();

    return motivationMessages[day % motivationMessages.length];
  }, []);

  const totalTrades = trades.length;

  const winRate =
    totalTrades > 0 ? Math.round((successfulTrades / totalTrades) * 100) : 0;

  const stats = [
    {
      label: "معاملات ثبت‌شده",
      value: formatNumber(totalTrades, locale),
      icon: BarChart3,
    },
    {
      label: "معاملات موفق",
      value: formatNumber(successfulTrades, locale),
      icon: CheckCircle2,
    },
    {
      label: "نرخ معاملات موفق",
      value: `${formatNumber(winRate, locale)}٪`,
      icon: Target,
    },
    {
      label: "نتیجه ثبت‌شده",
      value: formatResult(totalResult, locale),
      icon: BarChart3,
      positive: totalResult > 0,
      negative: totalResult < 0,
    },
  ];

  return (
    <div dir={isRtl ? "rtl" : "ltr"} className="space-y-6 pb-8">
      {/* Hero */}
      <section className="relative overflow-hidden rounded-[28px] border border-[var(--color-border)] bg-[var(--color-surface)]">
        <div className="pointer-events-none absolute -right-32 -top-32 h-80 w-80 rounded-full bg-[var(--color-primary)]/10 blur-3xl" />

        <div className="pointer-events-none absolute -bottom-40 -left-20 h-80 w-80 rounded-full bg-purple-500/5 blur-3xl" />

        <div className="relative p-6 sm:p-8 lg:p-12">
          <div className="flex items-center gap-2 text-xs font-medium text-[var(--color-primary)]">
            <Flame size={15} />
            <span>وقتشه یادت بیاد چرا شروع کردی</span>
          </div>

          <div className="mt-8 max-w-4xl">
            <p className="text-sm text-[var(--color-text-muted)]">امروز</p>

            <h1 className="mt-3 text-3xl font-bold leading-[1.35] tracking-tight sm:text-4xl lg:text-6xl">
              {dailyMessage.title}
            </h1>

            <p className="mt-5 max-w-2xl text-sm leading-8 text-[var(--color-text-secondary)] sm:text-base">
              {dailyMessage.text}
            </p>
          </div>

          <div className="mt-10 flex flex-wrap gap-3">
            <button
              type="button"
              onClick={() => navigate("/trading")}
              className="group flex items-center gap-2 rounded-xl bg-[var(--color-primary)] px-4 py-3 text-sm font-semibold text-white transition-all hover:-translate-y-0.5 hover:bg-[var(--color-primary-hover)]"
            >
              <LineChart size={17} />

              <span>برگرد به مسیر</span>

              {isRtl ? (
                <ArrowLeft
                  size={16}
                  className="transition-transform group-hover:-translate-x-1"
                />
              ) : (
                <ArrowRight
                  size={16}
                  className="transition-transform group-hover:translate-x-1"
                />
              )}
            </button>

            <button
              type="button"
              onClick={() => navigate("/tasks")}
              className="flex items-center gap-2 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-hover)] px-4 py-3 text-sm font-medium text-[var(--color-text-secondary)] transition-colors hover:text-[var(--color-text)]"
            >
              <CheckCircle2 size={17} />

              <span>کارهای امروز</span>
            </button>
          </div>
        </div>
      </section>

      {/* Why */}
      <section className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <div className="relative overflow-hidden rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-6 lg:col-span-2">
          <div className="absolute -left-10 -top-10 h-32 w-32 rounded-full bg-red-500/5 blur-2xl" />

          <div className="relative">
            <div className="flex items-center gap-2 text-sm font-bold">
              <Heart size={18} className="text-rose-400" />

              <span>چرا این مسیر را شروع کردی؟</span>
            </div>

            <div className="mt-6 space-y-5">
              <Reason
                number="01"
                title="برای ساختن یک نسخه قوی‌تر از خودم"
                text="قرار نیست فقط درآمد بیشتری داشته باشم؛ می‌خواهم آدمی باشم که روی تصمیم‌هایش کنترل دارد، یاد می‌گیرد و مسئولیت نتیجه‌هایش را می‌پذیرد."
              />

              <Reason
                number="02"
                title="برای آینده‌ای که هنوز ساخته نشده"
                text="چیزی که امروز ندارم، دلیل نمی‌شود فردا هم نداشته باشم. آینده از همین ساعت‌هایی ساخته می‌شود که کسی جز خودم اهمیتشان را نمی‌بیند."
              />

              <Reason
                number="03"
                title="برای خانواده‌ام"
                text="آدم‌هایی هستند که به من امید دارند. نه برای اینکه یک‌شبه موفق شوم؛ برای اینکه ببینند وقتی مسیر سخت شد، هنوز می‌توانم روی پای خودم بایستم."
              />
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-6">
          <div className="flex items-center gap-2 text-sm font-bold">
            <Goal size={18} className="text-[var(--color-primary)]" />

            <span>نسخه‌ای که می‌خواهی بشوی</span>
          </div>

          <div className="mt-6 space-y-4">
            <IdentityItem text="منظم‌تر" />
            <IdentityItem text="صبورتر" />
            <IdentityItem text="باهوش‌تر در تصمیم‌گیری" />
            <IdentityItem text="مسئولیت‌پذیرتر" />
            <IdentityItem text="ثابت‌قدم‌تر" />
          </div>

          <div className="mt-7 border-t border-[var(--color-border)] pt-5">
            <p className="text-xs leading-6 text-[var(--color-text-muted)]">
              تو قرار نیست یک‌شبه به این آدم تبدیل شوی.
              <br />
              هر روز فقط یک قدم.
            </p>
          </div>
        </div>
      </section>

      {/* Trading journey */}
      <section className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-6 sm:p-7">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <div className="flex items-center gap-2 text-sm font-bold">
              <Zap size={18} className="text-amber-400" />

              <span>مسیر تبدیل شدن به یک تریدر سودده</span>
            </div>

            <p className="mt-2 text-xs leading-6 text-[var(--color-text-muted)]">
              سودده شدن مقصد نیست؛ نتیجه‌ی ساختن یک سیستم و تکرار درست آن است.
            </p>
          </div>

          <span className="text-xs text-[var(--color-text-muted)]">
            قدم‌به‌قدم
          </span>
        </div>

        <div className="mt-7 grid grid-cols-1 gap-3 md:grid-cols-5">
          {journeySteps.map((step, index) => {
            const Icon = step.icon;

            return (
              <div
                key={step.number}
                className="group relative rounded-xl border border-[var(--color-border)] bg-[var(--color-bg)] p-4 transition-all duration-200 hover:-translate-y-1 hover:border-[var(--color-border-hover)]"
              >
                {index < journeySteps.length - 1 && (
                  <span className="pointer-events-none absolute top-8 hidden h-px w-3 bg-[var(--color-border)] ltr:-right-3 rtl:-left-3 md:block" />
                )}

                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold text-[var(--color-text-muted)]">
                    {step.number}
                  </span>

                  <Icon size={17} className="text-[var(--color-primary)]" />
                </div>

                <h3 className="mt-5 text-sm font-bold">{step.title}</h3>

                <p className="mt-2 text-xs leading-6 text-[var(--color-text-muted)]">
                  {step.description}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Real progress */}
      <section className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-sm font-bold">مسیر واقعی تو</h2>

              <p className="mt-1 text-xs text-[var(--color-text-muted)]">
                این بخش از اطلاعات واقعی Personal OS استفاده می‌کند.
              </p>
            </div>

            <BarChart3 size={19} className="text-[var(--color-primary)]" />
          </div>

          <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
            {stats.map((stat) => {
              const Icon = stat.icon;

              return (
                <div
                  key={stat.label}
                  className="rounded-xl border border-[var(--color-border)] bg-[var(--color-bg)] p-4"
                >
                  <Icon size={16} className="text-[var(--color-text-muted)]" />

                  <div
                    className={[
                      "mt-3 text-xl font-bold",
                      stat.positive
                        ? "text-[var(--color-success)]"
                        : stat.negative
                          ? "text-[var(--color-danger)]"
                          : "",
                    ].join(" ")}
                  >
                    {stat.value}
                  </div>

                  <div className="mt-1 text-[10px] leading-5 text-[var(--color-text-muted)]">
                    {stat.label}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-sm font-bold">امروز چقدر جلو رفتی؟</h2>

              <p className="mt-1 text-xs text-[var(--color-text-muted)]">
                پیشرفت کارهای امروزت را رها نکن.
              </p>
            </div>

            <span className="text-2xl font-bold text-[var(--color-primary)]">
              {formatNumber(progress, locale)}٪
            </span>
          </div>

          <div className="mt-6 h-3 overflow-hidden rounded-full bg-[var(--color-surface-hover)]">
            <div
              className="h-full rounded-full bg-[var(--color-primary)] transition-all duration-500"
              style={{
                width: `${progress}%`,
              }}
            />
          </div>

          <div className="mt-3 flex items-center justify-between text-xs">
            <span className="text-[var(--color-text-muted)]">
              {formatNumber(completedCount, locale)} از{" "}
              {formatNumber(totalCount, locale)} کار
            </span>

            <button
              type="button"
              onClick={() => navigate("/tasks")}
              className="font-medium text-[var(--color-primary)] hover:underline"
            >
              ادامه دادن
            </button>
          </div>
        </div>
      </section>

      {/* Hard days */}
      <section className="relative overflow-hidden rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-6 sm:p-8">
        <div className="pointer-events-none absolute inset-y-0 right-0 w-1/3 bg-gradient-to-l from-[var(--color-primary-soft)] to-transparent opacity-40" />

        <div className="relative max-w-3xl">
          <div className="flex items-center gap-2 text-sm font-bold">
            <RotateCcw size={18} className="text-[var(--color-primary)]" />

            <span>وقتی یک روز همه‌چیز خراب شد...</span>
          </div>

          <div className="mt-6 space-y-4 text-sm leading-8 text-[var(--color-text-secondary)]">
            <p>
              ممکن است یک معامله بد داشته باشی. ممکن است چند روز پشت سر هم
              نتیجه‌ای که می‌خواهی نگیری. ممکن است شک کنی که اصلاً برای این مسیر
              ساخته شده‌ای یا نه.
            </p>

            <p>
              آن روزها قرار نیست تصمیم بگیری که کل مسیر اشتباه بوده. فقط باید
              بفهمی چه چیزی اشتباه بوده، ثبتش کنی و دوباره برگردی.
            </p>

            <p className="font-semibold text-[var(--color-text)]">
              یک روز بد، هویت تو نیست.
              <br />
              یک معامله بد، آینده تو نیست.
              <br />
              یک شکست، پایان مسیر نیست.
            </p>
          </div>
        </div>
      </section>

      {/* Final */}
      <section className="rounded-[28px] border border-[var(--color-border)] bg-[var(--color-surface)] p-7 text-center sm:p-10">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-[var(--color-primary-soft)] text-[var(--color-primary)]">
          <Sparkles size={22} />
        </div>

        <h2 className="mx-auto mt-5 max-w-2xl text-2xl font-bold leading-[1.5] sm:text-3xl">
          تو لازم نیست امروز به جایی که می‌خواهی برسی.
          <br />
          فقط نباید آدمی را که می‌توانی بشوی، رها کنی.
        </h2>

        <p className="mx-auto mt-4 max-w-xl text-xs leading-7 text-[var(--color-text-muted)]">
          برگرد سر کارت. یک معامله را بررسی کن. یک کار را انجام بده. یک قدم کوچک
          هم هنوز یک قدم رو به جلوست.
        </p>

        <div className="mt-7 flex flex-wrap justify-center gap-3">
          <button
            type="button"
            onClick={() => navigate("/trading")}
            className="flex items-center gap-2 rounded-xl bg-[var(--color-primary)] px-5 py-3 text-sm font-semibold text-white transition-all hover:-translate-y-0.5 hover:bg-[var(--color-primary-hover)]"
          >
            <LineChart size={17} />
            ژورنال ترید
          </button>

          <button
            type="button"
            onClick={() => navigate("/tasks")}
            className="flex items-center gap-2 rounded-xl border border-[var(--color-border)] px-5 py-3 text-sm font-medium text-[var(--color-text-secondary)] transition-colors hover:text-[var(--color-text)]"
          >
            <CheckCircle2 size={17} />
            کارهای امروز
          </button>
        </div>
      </section>
      <VisionScroll isRtl={isRtl} />
    </div>
  );
}

function Reason({
  number,
  title,
  text,
}: {
  number: string;
  title: string;
  text: string;
}) {
  return (
    <div className="flex gap-4">
      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[var(--color-surface-hover)] text-[10px] font-bold text-[var(--color-primary)]">
        {number}
      </div>

      <div>
        <h3 className="text-sm font-bold">{title}</h3>

        <p className="mt-1 text-xs leading-6 text-[var(--color-text-muted)]">
          {text}
        </p>
      </div>
    </div>
  );
}

function IdentityItem({ text }: { text: string }) {
  return (
    <div className="flex items-center gap-3 rounded-xl border border-[var(--color-border)] bg-[var(--color-bg)] px-3 py-3">
      <CheckCircle2
        size={16}
        className="shrink-0 text-[var(--color-success)]"
      />

      <span className="text-xs font-medium">{text}</span>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────
   VisionScroll — اسکرول سینمایی اهداف + موسیقی ثابت
   ───────────────────────────────────────────────────────── */
/* ─────────────────────────────────────────────────────────
   VisionScroll — اسکرول سینمایی اهداف + موسیقی خودکار
   ───────────────────────────────────────────────────────── */
function VisionScroll({ isRtl }: { isRtl: boolean }) {
  const sectionRef = useRef<HTMLElement>(null);
  const audioRef = useRef<HTMLAudioElement>(null);
  const hasStartedRef = useRef(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const [progress, setProgress] = useState(0);

  // پیشرفت اسکرول
  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;

    const onScroll = () => {
      const rect = el.getBoundingClientRect();
      const total = el.offsetHeight - window.innerHeight;
      const scrolled = Math.min(Math.max(-rect.top, 0), total);
      const p = total > 0 ? scrolled / total : 0;
      setProgress(p);

      const idx = Math.min(
        visionGoals.length - 1,
        Math.floor(p * visionGoals.length),
      );
      setActiveIndex(idx);
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // پخش خودکار از ثانیه ۵۵ وقتی نزدیک سکشن شدی
  useEffect(() => {
    const el = sectionRef.current;
    const audio = audioRef.current;
    if (!el || !audio) return;

    const tryPlay = () => {
      if (hasStartedRef.current) return;
      audio.volume = 0.55;
      audio.currentTime = 55;
      audio
        .play()
        .then(() => {
          hasStartedRef.current = true;
        })
        .catch(() => {});
    };

    const tryPause = () => {
      if (!audio.paused) audio.pause();
      hasStartedRef.current = false;
    };

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          tryPlay();
        } else {
          tryPause();
        }
      },
      { threshold: 0.08 },
    );
    observer.observe(el);

    // اگر مرورگر autoplay رو بلاک کرد، با اولین کلیک/لمس شروع می‌شه
    const unlock = () => {
      if (el.getBoundingClientRect().top < window.innerHeight) {
        tryPlay();
      }
    };
    document.addEventListener("click", unlock, { once: true });
    document.addEventListener("touchstart", unlock, { once: true });
    document.addEventListener("keydown", unlock, { once: true });

    return () => {
      observer.disconnect();
      document.removeEventListener("click", unlock);
      document.removeEventListener("touchstart", unlock);
      document.removeEventListener("keydown", unlock);
      audio.pause();
    };
  }, []);

  const slideHeight = "100vh";

  return (
    <section
      ref={sectionRef}
      className="relative mt-16 -mx-4 sm:-mx-6 lg:-mx-8"
      style={{ height: `calc(${visionGoals.length + 1.4} * ${slideHeight})` }}
    >
      <audio ref={audioRef} src={VISION_MUSIC_SRC} loop preload="auto" />

      <div className="sticky top-0 flex h-screen w-full items-center justify-center overflow-hidden bg-[#050508]">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(30,20,60,0.45)_0%,_transparent_70%)]" />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/40" />

        {/* نوار پیشرفت */}
        <div
          className={`absolute top-1/2 z-20 flex -translate-y-1/2 flex-col gap-2 ${isRtl ? "right-5" : "left-5"}`}
        >
          {visionGoals.map((_, i) => (
            <div
              key={i}
              className={[
                "h-1.5 w-1.5 rounded-full transition-all duration-500",
                i === activeIndex
                  ? "h-6 bg-[var(--color-primary)]"
                  : i < activeIndex
                    ? "bg-white/50"
                    : "bg-white/20",
              ].join(" ")}
            />
          ))}
        </div>

        {/* اسلایدها */}
        {visionGoals.map((goal, i) => {
          const isActive = i === activeIndex;
          const isPast = i < activeIndex;

          return (
            <div
              key={goal.id}
              className="absolute inset-0 flex items-center justify-center px-6 transition-all duration-700 ease-out"
              style={{
                opacity: isActive ? 1 : 0,
                transform: isActive
                  ? "scale(1) translateY(0)"
                  : isPast
                    ? "scale(0.92) translateY(-40px)"
                    : "scale(1.06) translateY(40px)",
                pointerEvents: isActive ? "auto" : "none",
              }}
            >
              <div className="relative w-full max-w-3xl">
                <div className="pointer-events-none absolute -inset-8 rounded-[40px] bg-[var(--color-primary)]/20 blur-3xl" />

                <div className="relative overflow-hidden rounded-[24px] border border-white/10 shadow-[0_25px_80px_-20px_rgba(0,0,0,0.8)]">
                  <div className="aspect-[16/10] w-full overflow-hidden bg-black/40">
                    <img
                      src={goal.src}
                      alt={goal.title}
                      className="h-full w-full object-cover transition-transform duration-[1.2s] ease-out"
                      style={{
                        transform: isActive ? "scale(1)" : "scale(1.12)",
                      }}
                      loading="lazy"
                    />
                    <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
                  </div>

                  <div
                    className={`absolute bottom-0 inset-x-0 p-6 sm:p-8 ${isRtl ? "text-right" : "text-left"}`}
                  >
                    <p className="text-[11px] font-medium tracking-widest text-[var(--color-primary)] uppercase">
                      هدف {String(i + 1).padStart(2, "0")}
                    </p>
                    <h3 className="mt-1 text-2xl font-bold text-white sm:text-3xl">
                      {goal.title}
                    </h3>
                    <p className="mt-2 max-w-md text-sm leading-7 text-white/70">
                      {goal.caption}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          );
        })}

        {/* متن نهایی */}
        <div
          className="absolute inset-0 flex flex-col items-center justify-center px-6 text-center transition-all duration-700 ease-out"
          style={{
            opacity: progress > 0.92 ? 1 : 0,
            transform:
              progress > 0.92
                ? "scale(1) translateY(0)"
                : "scale(0.95) translateY(30px)",
            pointerEvents: progress > 0.92 ? "auto" : "none",
          }}
        >
          <div className="pointer-events-none absolute inset-0 bg-black/60" />
          <div className="relative z-10 max-w-2xl">
            <div className="mx-auto mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-[var(--color-primary)]/20 text-[var(--color-primary)]">
              <Flame size={26} />
            </div>
            <h2 className="text-3xl font-bold leading-[1.4] text-white sm:text-4xl lg:text-5xl">
              هنوز می‌خوای کم بیاری؟
            </h2>
            <p className="mx-auto mt-5 max-w-lg text-sm leading-8 text-white/65 sm:text-base">
              این تصاویر فقط خیال نیست. نتیجه‌ی تصمیم‌هایی است که امروز می‌گیری.
              برگرد سر مسیرت.
            </p>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
              <Link
                to="/tasks"
                className="inline-flex items-center gap-2 rounded-xl bg-[var(--color-primary)] px-6 py-3.5 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:bg-[var(--color-primary-hover)]"
              >
                <CheckCircle2 size={17} />
                کارهای امروز
              </Link>
              <Link
                to="/trading"
                className="inline-flex items-center gap-2 rounded-xl border border-white/20 bg-white/5 px-6 py-3.5 text-sm font-medium text-white/90 backdrop-blur transition hover:bg-white/10"
              >
                <LineChart size={17} />
                ژورنال ترید
              </Link>
            </div>
          </div>
        </div>

        {/* راهنمای اسکرول */}
        <div
          className="absolute bottom-8 left-1/2 z-20 flex -translate-x-1/2 flex-col items-center gap-2 transition-opacity duration-500"
          style={{ opacity: progress < 0.05 ? 0.7 : 0 }}
        >
          <span className="text-[11px] tracking-wider text-white/50">
            آروم اسکرول کن
          </span>
          <div className="h-8 w-5 rounded-full border border-white/30 p-1">
            <div className="h-2 w-full animate-bounce rounded-full bg-white/60" />
          </div>
        </div>
      </div>
    </section>
  );
}
