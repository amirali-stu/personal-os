export type ColorMood = "violet" | "blue" | "emerald" | "amber" | "rose";

type ColorMoodConfig = {
  primary: string;
  primaryHover: string;
  primarySoft: string;
};

export const colorMoods: Record<ColorMood, ColorMoodConfig> = {
  violet: {
    primary: "#A855F7",
    primaryHover: "#9333EA",
    primarySoft: "rgba(168, 85, 247, 0.12)",
  },

  blue: {
    primary: "#3B82F6",
    primaryHover: "#2563EB",
    primarySoft: "rgba(59, 130, 246, 0.12)",
  },

  emerald: {
    primary: "#10B981",
    primaryHover: "#059669",
    primarySoft: "rgba(16, 185, 129, 0.12)",
  },

  amber: {
    primary: "#F59E0B",
    primaryHover: "#D97706",
    primarySoft: "rgba(245, 158, 11, 0.12)",
  },

  rose: {
    primary: "#F43F5E",
    primaryHover: "#E11D48",
    primarySoft: "rgba(244, 63, 94, 0.12)",
  },
};
