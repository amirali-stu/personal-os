import { X } from "lucide-react";
import { getTagStyle, type OptionItem } from "../types";

type Props = {
  item: Pick<OptionItem, "label" | "color">;
  size?: "sm" | "md";
  onClick?: () => void;
  onRemove?: () => void;
  className?: string;
};

export function TagPill({
  item,
  size = "sm",
  onClick,
  onRemove,
  className = "",
}: Props) {
  const style = getTagStyle(item.color);

  return (
    <span
      onClick={onClick}
      style={style}
      className={[
        "inline-flex max-w-full text-center pb-0 pt-1! items-center gap-0.5 truncate rounded-[4px] font-medium",
        size === "sm"
          ? "px-2 py-[3px] text-[12px] leading-[1.3]"
          : "px-2.5 py-1 text-[13px] leading-[1.3]",
        onClick ? "cursor-pointer hover:opacity-90" : "",
        className,
      ].join(" ")}
      title={item.label}
    >
      <span className="truncate">{item.label}</span>
      {onRemove && (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onRemove();
          }}
          className="ms-0.5 inline-flex h-3.5 w-3.5 shrink-0 items-center justify-center rounded-sm opacity-70 hover:opacity-100"
        >
          <X size={11} strokeWidth={2.5} />
        </button>
      )}
    </span>
  );
}
