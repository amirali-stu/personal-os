import { Library, Plus } from "lucide-react";

type Props = {
  onCreatePlaylist: () => void;
};

export function MusicHeader({ onCreatePlaylist }: Props) {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--color-primary-soft)] text-[var(--color-primary)]">
          <Library size={20} />
        </div>

        <h1 className="text-xl font-bold text-white">موسیقی</h1>

        <p className="mt-1 text-xs text-[var(--color-text-muted)]">
          کتابخانه موسیقی شخصی شما
        </p>
      </div>

      <button
        type="button"
        onClick={onCreatePlaylist}
        className="flex items-center justify-center gap-2 rounded-xl bg-[var(--color-primary)] px-4 py-3 text-xs font-bold text-white transition-colors hover:bg-[var(--color-primary-hover)]"
      >
        <Plus size={16} />
        لیست جدید
      </button>
    </div>
  );
}
