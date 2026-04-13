"use client";

interface ChipProps {
  label: string;
  selected?: boolean;
  onClick?: () => void;
}

export default function Chip({ label, selected = false, onClick }: ChipProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`
        rounded-[20px] px-3.5 py-2
        font-body text-sm font-medium
        transition-colors duration-150
        ${
          selected
            ? "bg-primary text-white"
            : "bg-neutral-100 text-neutral-600 hover:bg-neutral-200"
        }
      `}
    >
      {label}
    </button>
  );
}
