const GROUP_COLORS: Record<string, string> = {
  PB: "#4A5899",
  PR: "#9A5B7A",
  FB: "#C4853A",
  FR: "#3A8A7A",
};

interface TypeBadgeProps {
  typeCode: string;
  className?: string;
}

export default function TypeBadge({ typeCode, className = "" }: TypeBadgeProps) {
  const group = typeCode.slice(0, 2).toUpperCase();
  const bgColor = GROUP_COLORS[group] || "#4A5899";

  return (
    <span
      className={`
        inline-flex items-center justify-center
        rounded-full px-3 py-1
        font-body text-sm font-semibold text-white
        tracking-wider
        ${className}
      `}
      style={{ backgroundColor: bgColor }}
    >
      {typeCode.toUpperCase()}
    </span>
  );
}
