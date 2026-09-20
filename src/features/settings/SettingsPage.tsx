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
import { useTranslation } from "react-i18next";

import { useSettingsStore } from "../../app/store/settingsStore";
import { SettingsSection } from "./components/SettingsSection";
import { SettingsSelect } from "./components/SettingsSelect";
import { SettingsToggle } from "./components/SettingsToggle";

export function SettingsPage() {
  const { t } = useTranslation();

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
            <h1 className="text-xl font-bold text-white">
              {t("settings.title")}
            </h1>

            <p className="mt-1 text-[11px] text-[var(--color-text-muted)]">
              {t("settings.subtitle")}
            </p>
          </div>
        </div>
      </section>

      {/* Appearance */}
      <SettingsSection
        title={t("settings.appearance.title")}
        description={t("settings.appearance.description")}
        icon={<Palette size={19} />}
      >
        <SettingsToggle
          label={t("settings.appearance.darkMode.label")}
          description={t("settings.appearance.darkMode.description")}
          checked={darkMode}
          onChange={(value) => updateSetting("darkMode", value)}
        />

        <SettingsSelect
          label={t("settings.appearance.accentColor.label")}
          description={t("settings.appearance.accentColor.description")}
          value={accentColor}
          options={[
            {
              value: "violet",
              label: t("settings.appearance.accentColor.purple"),
            },
            {
              value: "blue",
              label: t("settings.appearance.accentColor.blue"),
            },
            {
              value: "emerald",
              label: t("settings.appearance.accentColor.emerald"),
            },
            {
              value: "amber",
              label: t("settings.appearance.accentColor.amber"),
            },
            {
              value: "rose",
              label: t("settings.appearance.accentColor.rose"),
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
          label={t("settings.appearance.displayMode.label")}
          description={t("settings.appearance.displayMode.description")}
          value={displayMode}
          options={[
            {
              value: "desktop",
              label: t("settings.appearance.displayMode.standard"),
            },
            {
              value: "compact",
              label: t("settings.appearance.displayMode.compact"),
            },
          ]}
          onChange={(value) =>
            updateSetting("displayMode", value as "desktop" | "compact")
          }
        />
      </SettingsSection>

      {/* Application */}
      <SettingsSection
        title={t("settings.application.title")}
        description={t("settings.application.description")}
        icon={<Monitor size={19} />}
      >
        <SettingsSelect
          label={t("settings.application.language.label")}
          description={t("settings.application.language.description")}
          value={language}
          options={[
            {
              value: "fa",
              label: t("settings.application.language.fa"),
            },
            {
              value: "en",
              label: t("settings.application.language.en"),
            },
          ]}
          onChange={(value) => updateSetting("language", value as "fa" | "en")}
        />

        <SettingsSelect
          label={t("settings.application.dateFormat.label")}
          description={t("settings.application.dateFormat.description")}
          value={dateFormat}
          options={[
            {
              value: "jalali",
              label: t("settings.application.dateFormat.jalali"),
            },
            {
              value: "gregorian",
              label: t("settings.application.dateFormat.gregorian"),
            },
          ]}
          onChange={(value) =>
            updateSetting("dateFormat", value as "jalali" | "gregorian")
          }
        />

        <SettingsSelect
          label={t("settings.application.timezone.label")}
          description={t("settings.application.timezone.description")}
          value={timezone}
          options={[
            {
              value: "local",
              label: t("settings.application.timezone.local"),
            },
            {
              value: "utc",
              label: t("settings.application.timezone.utc"),
            },
          ]}
          onChange={(value) =>
            updateSetting("timezone", value as "local" | "utc")
          }
        />
      </SettingsSection>

      {/* Music */}
      <SettingsSection
        title={t("settings.music.title")}
        description={t("settings.music.description")}
        icon={<Volume2 size={19} />}
      >
        <SettingsToggle
          label={t("settings.music.autoPlay.label")}
          description={t("settings.music.autoPlay.description")}
          checked={autoPlay}
          onChange={(value) => updateSetting("autoPlay", value)}
        />

        <SettingsSelect
          label={t("settings.music.defaultSpeed.label")}
          description={t("settings.music.defaultSpeed.description")}
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
        title={t("settings.markets.title")}
        description={t("settings.markets.description")}
        icon={<Globe size={19} />}
      >
        <SettingsToggle
          label={t("settings.markets.autoUpdate.label")}
          description={t("settings.markets.autoUpdate.description")}
          checked={marketUpdates}
          onChange={(value) => updateSetting("marketUpdates", value)}
        />

        <SettingsSelect
          label={t("settings.markets.currency.label")}
          description={t("settings.markets.currency.description")}
          value="toman"
          options={[
            {
              value: "toman",
              label: t("settings.markets.currency.toman"),
            },
            {
              value: "irr",
              label: t("settings.markets.currency.rial"),
            },
          ]}
        />
      </SettingsSection>

      {/* Trading */}
      <SettingsSection
        title={t("settings.trading.title")}
        description={t("settings.trading.description")}
        icon={<ShieldCheck size={19} />}
      >
        <SettingsSelect
          label={t("settings.trading.tradeLimit.label")}
          description={t("settings.trading.tradeLimit.description")}
          value={String(tradeLimit)}
          options={[
            {
              value: "1",
              label: t("settings.trading.trade", { count: 1 }),
            },
            {
              value: "2",
              label: t("settings.trading.trades", { count: 2 }),
            },
            {
              value: "3",
              label: t("settings.trading.trades", { count: 3 }),
            },
            {
              value: "5",
              label: t("settings.trading.trades", { count: 5 }),
            },
          ]}
          onChange={(value) => updateSetting("tradeLimit", Number(value))}
        />
      </SettingsSection>

      {/* AI */}
      <SettingsSection
        title={t("settings.ai.title")}
        description={t("settings.ai.description")}
        icon={<Bot size={19} />}
      >
        <SettingsToggle
          label={t("settings.ai.localOnly.label")}
          description={t("settings.ai.localOnly.description")}
          checked={aiLocalOnly}
          onChange={(value) => updateSetting("aiLocalOnly", value)}
        />

        <SettingsSelect
          label={t("settings.ai.model.label")}
          description={t("settings.ai.model.description")}
          value="local"
          options={[
            {
              value: "local",
              label: t("settings.ai.model.local"),
            },
            {
              value: "cloud",
              label: t("settings.ai.model.cloud"),
            },
          ]}
        />
      </SettingsSection>

      {/* Data */}
      <SettingsSection
        title={t("settings.data.title")}
        description={t("settings.data.description")}
        icon={<Database size={19} />}
      >
        <button
          type="button"
          className="flex w-full cursor-pointer items-center gap-3 px-5 py-4 text-right transition-colors hover:bg-[var(--color-surface-hover)]"
        >
          <Database size={17} className="text-[var(--color-text-muted)]" />

          <div>
            <p className="text-xs font-medium text-white">
              {t("settings.data.export.label")}
            </p>

            <p className="mt-1 text-[10px] text-[var(--color-text-muted)]">
              {t("settings.data.export.description")}
            </p>
          </div>
        </button>

        <button
          type="button"
          className="flex w-full cursor-pointer items-center gap-3 px-5 py-4 text-right transition-colors hover:bg-[var(--color-surface-hover)]"
        >
          <RotateCcw size={17} className="text-[var(--color-text-muted)]" />

          <div>
            <p className="text-xs font-medium text-white">
              {t("settings.data.import.label")}
            </p>

            <p className="mt-1 text-[10px] text-[var(--color-text-muted)]">
              {t("settings.data.import.description")}
            </p>
          </div>
        </button>

        <button
          type="button"
          className="flex w-full cursor-pointer items-center gap-3 px-5 py-4 text-right transition-colors hover:bg-red-500/5"
        >
          <Trash2 size={17} className="text-red-400" />

          <div>
            <p className="text-xs font-medium text-red-400">
              {t("settings.data.delete.label")}
            </p>

            <p className="mt-1 text-[10px] text-[var(--color-text-muted)]">
              {t("settings.data.delete.description")}
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
            <p className="text-xs font-bold text-white">
              {t("settings.about.name")}
            </p>

            <p className="mt-1 text-[10px] text-[var(--color-text-muted)]">
              {t("settings.about.description")}
            </p>
          </div>
        </div>

        <div className="mt-5 flex items-center gap-2 border-t border-[var(--color-border)] pt-4 text-[10px] text-[var(--color-text-muted)]">
          <Languages size={13} />
          {t("settings.about.version")}
        </div>
      </section>
    </div>
  );
}
