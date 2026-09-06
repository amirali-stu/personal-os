import {
  Bot,
  Database,
  Globe,
  Languages,
  Monitor,
  Palette,
  RotateCcw,
  ShieldCheck,
  SlidersHorizontal,
  Sparkles,
  Trash2,
  Volume2,
} from "lucide-react";
import { useState } from "react";

import { SettingsSection } from "./components/SettingsSection";
import { SettingsSelect } from "./components/SettingsSelect";
import { SettingsToggle } from "./components/SettingsToggle";
import { useSettingsStore } from "../../app/store/settingsStore";

export function SettingsPage() {
  const accentColor = useSettingsStore((state) => state.accentColor);

  const darkMode = useSettingsStore((state) => state.darkMode);

  const displayMode = useSettingsStore((state) => state.displayMode);

  const language = useSettingsStore((state) => state.language);

  const dateFormat = useSettingsStore((state) => state.dateFormat);

  const timezone = useSettingsStore((state) => state.timezone);

  const autoPlay = useSettingsStore((state) => state.autoPlay);

  const defaultSpeed = useSettingsStore((state) => state.defaultSpeed);

  const marketUpdates = useSettingsStore((state) => state.marketUpdates);

  const tradeLimit = useSettingsStore((state) => state.tradeLimit);

  const aiLocalOnly = useSettingsStore((state) => state.aiLocalOnly);

  const updateSetting = useSettingsStore((state) => state.updateSetting);

  return (
    <div className="space-y-6">
      {/* Header */}
      <section>
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[var(--color-primary-soft)] text-[var(--color-primary)]">
            <SlidersHorizontal size={21} />
          </div>

          <div>
            <h1 className="text-xl font-bold text-white">تنظیمات</h1>

            <p className="mt-1 text-[11px] text-[var(--color-text-muted)]">
              تنظیمات شخصی Personal OS
            </p>
          </div>
        </div>
      </section>

      {/* Appearance */}
      <SettingsSection
        title="ظاهر"
        description="ظاهر و نحوه نمایش برنامه"
        icon={<Palette size={19} />}
      >
        <SettingsToggle
          label="حالت تاریک"
          description="استفاده از رابط کاربری تیره"
          checked={darkMode}
          onChange={(value) => updateSetting("darkMode", value)}
        />

        <SettingsSelect
          label="رنگ اصلی"
          description="رنگ اصلی رابط کاربری"
          value={accentColor}
          options={[
            {
              value: "violet",
              label: "بنفش الکتریکی",
            },
            {
              value: "blue",
              label: "آبی تکنولوژیک",
            },
            {
              value: "emerald",
              label: "سبز زمردی",
            },
            {
              value: "amber",
              label: "کهربایی",
            },
            {
              value: "rose",
              label: "رز",
            },
          ]}
          onChange={(value) =>
            updateSetting(
              "accentColor",
              value as "violet" | "blue" | "emerald" | "amber" | "rose",
            )
          }
        />

        <SettingsSelect
          label="نمایش"
          description="نحوه نمایش رابط کاربری"
          value={displayMode}
          options={[
            {
              value: "desktop",
              label: "استاندارد",
            },
            {
              value: "compact",
              label: "فشرده",
            },
          ]}
          onChange={(value) =>
            updateSetting("displayMode", value as "desktop" | "compact")
          }
        />
      </SettingsSection>

      {/* Application */}
      <SettingsSection
        title="برنامه"
        description="تنظیمات عمومی Personal OS"
        icon={<Monitor size={19} />}
      >
        <SettingsSelect
          label="زبان"
          description="زبان رابط کاربری برنامه"
          value={language}
          options={[
            {
              value: "fa",
              label: "فارسی",
            },
            {
              value: "en",
              label: "English",
            },
          ]}
          onChange={(value) => updateSetting("language", value as "fa" | "en")}
        />

        <SettingsSelect
          label="فرمت تاریخ"
          description="نحوه نمایش تاریخ‌ها"
          value={dateFormat}
          options={[
            {
              value: "jalali",
              label: "شمسی",
            },
            {
              value: "gregorian",
              label: "میلادی",
            },
          ]}
          onChange={(value) =>
            updateSetting("dateFormat", value as "jalali" | "gregorian")
          }
        />

        <SettingsSelect
          label="منطقه زمانی"
          description="منطقه زمانی مورد استفاده برنامه"
          value={timezone}
          options={[
            {
              value: "local",
              label: "زمان محلی دستگاه",
            },
            {
              value: "utc",
              label: "UTC",
            },
          ]}
          onChange={(value) =>
            updateSetting("timezone", value as "local" | "utc")
          }
        />
      </SettingsSection>

      {/* Music */}
      <SettingsSection
        title="موسیقی"
        description="تنظیمات پخش موسیقی"
        icon={<Volume2 size={19} />}
      >
        <SettingsToggle
          label="پخش خودکار"
          description="بعد از انتخاب آهنگ، پخش به‌صورت خودکار شروع شود"
          checked={autoPlay}
          onChange={(value) => updateSetting("autoPlay", value)}
        />

        <SettingsSelect
          label="سرعت پیش‌فرض"
          description="سرعت اولیه پخش آهنگ‌ها"
          value={String(defaultSpeed)}
          options={[
            { value: "0.5", label: "0.5x" },
            { value: "0.75", label: "0.75x" },
            { value: "1", label: "1x" },
            { value: "1.25", label: "1.25x" },
            { value: "1.5", label: "1.5x" },
            { value: "2", label: "2x" },
          ]}
          onChange={(value) => updateSetting("defaultSpeed", Number(value))}
        />
      </SettingsSection>

      {/* Markets */}
      <SettingsSection
        title="بازار"
        description="تنظیمات مربوط به قیمت‌ها و بازار"
        icon={<Globe size={19} />}
      >
        <SettingsToggle
          label="بروزرسانی خودکار"
          description="دریافت خودکار آخرین قیمت‌های بازار"
          checked={marketUpdates}
          onChange={(value) => updateSetting("marketUpdates", value)}
        />

        <SettingsSelect
          label="واحد پول"
          description="واحد نمایش قیمت‌های داخلی"
          value="toman"
          options={[
            {
              value: "toman",
              label: "تومان",
            },
            {
              value: "irr",
              label: "ریال",
            },
          ]}
        />
      </SettingsSection>

      {/* Trading */}
      <SettingsSection
        title="ترید"
        description="تنظیمات مربوط به ژورنال معاملاتی"
        icon={<ShieldCheck size={19} />}
      >
        <SettingsSelect
          label="حداکثر معامله روزانه"
          description="حداکثر تعداد معاملات قابل ثبت در یک روز"
          value={String(tradeLimit)}
          options={[
            {
              value: "1",
              label: "۱ معامله",
            },
            {
              value: "2",
              label: "۲ معامله",
            },
            {
              value: "3",
              label: "۳ معامله",
            },
            {
              value: "5",
              label: "۵ معامله",
            },
          ]}
          onChange={(value) => updateSetting("tradeLimit", Number(value))}
        />
      </SettingsSection>

      {/* AI */}
      <SettingsSection
        title="هوش مصنوعی"
        description="تنظیمات دستیار هوشمند"
        icon={<Bot size={19} />}
      >
        <SettingsToggle
          label="حالت Local Only"
          description="استفاده از مدل هوش مصنوعی روی دستگاه تا حد امکان"
          checked={aiLocalOnly}
          onChange={(value) => updateSetting("aiLocalOnly", value)}
        />

        <SettingsSelect
          label="مدل پیش‌فرض"
          description="مدل مورد استفاده دستیار هوشمند"
          value="local"
          options={[
            {
              value: "local",
              label: "مدل Local",
            },
            {
              value: "cloud",
              label: "مدل Cloud",
            },
          ]}
        />
      </SettingsSection>

      {/* Data */}
      <SettingsSection
        title="داده‌ها"
        description="مدیریت اطلاعات ذخیره‌شده در برنامه"
        icon={<Database size={19} />}
      >
        <button
          type="button"
          className="flex w-full cursor-pointer items-center gap-3 px-5 py-4 text-right transition-colors hover:bg-[var(--color-surface-hover)]"
        >
          <Database size={17} className="text-[var(--color-text-muted)]" />

          <div>
            <p className="text-xs font-medium text-white">
              خروجی گرفتن از داده‌ها
            </p>

            <p className="mt-1 text-[10px] text-[var(--color-text-muted)]">
              دریافت یک نسخه پشتیبان از اطلاعات Personal OS
            </p>
          </div>
        </button>

        <button
          type="button"
          className="flex w-full cursor-pointer items-center gap-3 px-5 py-4 text-right transition-colors hover:bg-[var(--color-surface-hover)]"
        >
          <RotateCcw size={17} className="text-[var(--color-text-muted)]" />

          <div>
            <p className="text-xs font-medium text-white">وارد کردن داده‌ها</p>

            <p className="mt-1 text-[10px] text-[var(--color-text-muted)]">
              بازیابی اطلاعات از یک فایل پشتیبان
            </p>
          </div>
        </button>

        <button
          type="button"
          className="flex w-full cursor-pointer items-center gap-3 px-5 py-4 text-right transition-colors hover:bg-red-500/5"
        >
          <Trash2 size={17} className="text-red-400" />

          <div>
            <p className="text-xs font-medium text-red-400">حذف تمام داده‌ها</p>

            <p className="mt-1 text-[10px] text-[var(--color-text-muted)]">
              تمام اطلاعات ذخیره‌شده از این دستگاه حذف خواهد شد
            </p>
          </div>
        </button>
      </SettingsSection>

      {/* About */}
      <section className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-5">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--color-primary-soft)] text-[var(--color-primary)]">
            <Sparkles size={18} />
          </div>

          <div>
            <p className="text-xs font-bold text-white">Personal OS</p>

            <p className="mt-1 text-[10px] text-[var(--color-text-muted)]">
              سیستم شخصی مدیریت زندگی، ترید، موسیقی و AI
            </p>
          </div>
        </div>

        <div className="mt-5 flex items-center gap-2 border-t border-[var(--color-border)] pt-4 text-[10px] text-[var(--color-text-muted)]">
          <Languages size={13} />
          نسخه اولیه رابط کاربری
        </div>
      </section>
    </div>
  );
}
