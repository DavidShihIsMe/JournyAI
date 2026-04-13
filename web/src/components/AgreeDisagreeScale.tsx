"use client";

interface AgreeDisagreeScaleProps {
  value: number | null; // 1-7, null if not selected
  onChange: (value: number) => void;
}

const LABELS = ["Strongly\nDisagree", "", "", "Neutral", "", "", "Strongly\nAgree"];

export default function AgreeDisagreeScale({
  value,
  onChange,
}: AgreeDisagreeScaleProps) {
  return (
    <div className="flex flex-col items-center gap-3">
      <div className="flex items-center justify-between w-full max-w-[340px] gap-2">
        {[1, 2, 3, 4, 5, 6, 7].map((n) => {
          const selected = value === n;
          // Outer circles are larger, middle is medium, center is smaller
          const size =
            n === 1 || n === 7
              ? "w-11 h-11"
              : n === 2 || n === 6
                ? "w-10 h-10"
                : n === 3 || n === 5
                  ? "w-9 h-9"
                  : "w-8 h-8";

          return (
            <button
              key={n}
              type="button"
              onClick={() => onChange(n)}
              className={`
                ${size} rounded-full border-2 transition-all duration-150
                flex items-center justify-center flex-shrink-0
                ${
                  selected
                    ? "bg-primary border-primary scale-110"
                    : "bg-white border-neutral-300 hover:border-primary"
                }
              `}
              aria-label={`${n} of 7`}
            />
          );
        })}
      </div>
      <div className="flex justify-between w-full max-w-[340px]">
        <span className="font-body text-xs text-neutral-400 text-left whitespace-pre-line leading-tight">
          {LABELS[0]}
        </span>
        <span className="font-body text-xs text-neutral-400 text-center whitespace-pre-line leading-tight">
          {LABELS[3]}
        </span>
        <span className="font-body text-xs text-neutral-400 text-right whitespace-pre-line leading-tight">
          {LABELS[6]}
        </span>
      </div>
    </div>
  );
}
