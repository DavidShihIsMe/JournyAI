import DashboardNav from "@/components/DashboardNav";
import { INK, PAPER } from "@/components/landing/brand";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div
      className="journy-root journy-paper-texture flex w-full min-h-dvh flex-col md:flex-row"
      style={{ background: PAPER, color: INK }}
    >
      <DashboardNav />
      <main
        className="flex min-h-0 flex-1 flex-col pb-[calc(4rem+env(safe-area-inset-bottom,0px))] md:min-h-dvh md:pb-0"
        style={{ background: PAPER }}
      >
        <div className="mx-auto flex min-h-0 w-full max-w-[1200px] flex-1 flex-col px-6 py-8">{children}</div>
      </main>
    </div>
  );
}
