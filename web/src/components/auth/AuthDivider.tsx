export default function AuthDivider() {
  return (
    <div className="relative w-full flex items-center justify-center">
      <div className="absolute inset-x-0 top-1/2 h-px bg-[#E5E7EB]" />
      <span className="relative bg-white px-3 font-body text-sm text-[#9CA3AF]">
        or
      </span>
    </div>
  );
}
