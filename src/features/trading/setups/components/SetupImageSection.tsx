import { useRef } from "react";
import { ImagePlus, Trash2, X } from "lucide-react";

type Props = {
  label: string;
  images: (string | null)[];
  onChange: (images: (string | null)[]) => void;
  single?: boolean;
};

function fileToDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

export function SetupImageSection({
  label,
  images,
  onChange,
  single = false,
}: Props) {
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  async function handleFile(index: number, file: File | undefined) {
    if (!file || !file.type.startsWith("image/")) return;
    const dataUrl = await fileToDataUrl(file);
    const next = [...images];
    next[index] = dataUrl;
    onChange(next);
  }

  function clear(index: number) {
    const next = [...images];
    next[index] = null;
    onChange(next);
  }

  function removeSlot(index: number) {
    if (single) {
      onChange([null]);
      return;
    }
    onChange(images.filter((_, i) => i !== index));
  }

  function addSlot() {
    onChange([...images, null]);
  }

  return (
    <div className="space-y-3">
      <h3 className="text-start text-sm font-semibold text-white">{label}</h3>

      <div className="space-y-3">
        {images.map((img, index) => (
          <div key={index} className="relative">
            {img ? (
              <div className="group relative overflow-hidden rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)]">
                <img
                  src={img}
                  alt={`${label} ${index + 1}`}
                  className="max-h-96 w-full object-contain"
                />
                <div className="absolute start-2 top-2 flex gap-1 opacity-0 transition-opacity group-hover:opacity-100">
                  <button
                    type="button"
                    onClick={() => clear(index)}
                    className="flex h-8 w-8 items-center justify-center rounded-lg bg-black/70 text-white hover:bg-red-500/80"
                    title="پاک کردن عکس"
                  >
                    <X size={16} />
                  </button>
                  {!single && (
                    <button
                      type="button"
                      onClick={() => removeSlot(index)}
                      className="flex h-8 w-8 items-center justify-center rounded-lg bg-black/70 text-white hover:bg-red-500/80"
                      title="حذف اسلات"
                    >
                      <Trash2 size={16} />
                    </button>
                  )}
                </div>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => inputRefs.current[index]?.click()}
                className="flex w-full items-center gap-3 rounded-xl border border-dashed border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-4 text-sm text-[var(--color-text-muted)] transition-colors hover:border-[var(--color-primary)] hover:bg-[var(--color-surface-hover)] hover:text-white"
              >
                <ImagePlus size={20} className="shrink-0" />
                <span>اضافه کردن عکس</span>
              </button>
            )}
            <input
              ref={(el) => {
                inputRefs.current[index] = el;
              }}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => {
                handleFile(index, e.target.files?.[0]);
                e.target.value = "";
              }}
            />
          </div>
        ))}
      </div>

      {!single && (
        <button
          type="button"
          onClick={addSlot}
          className="flex w-full items-center justify-center gap-2 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-2.5 text-sm text-[var(--color-text-secondary)] transition-colors hover:bg-[var(--color-surface-hover)] hover:text-white"
        >
          <ImagePlus size={16} />
          اضافه کردن عکس
        </button>
      )}
    </div>
  );
}
