import DashboardNav from "@/components/DashboardNav";
import { INK, PAPER } from "@/components/landing/brand";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div
      className="journy-root journy-paper-texture min-h-full flex flex-col md:flex-row"
      style={{ background: PAPER, color: INK }}
    >
      <DashboardNav />
      <main className="flex-1 pb-4 md:pb-0" style={{ background: PAPER }}>
        <div className="mx-auto max-w-[1200px] px-6 py-8">{children}</div>
      </main>
    </div>
  );
}
