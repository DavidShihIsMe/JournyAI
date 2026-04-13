import DashboardNav from "@/components/DashboardNav";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-full flex flex-col md:flex-row">
      <DashboardNav />
      <main className="flex-1 bg-neutral-50 pb-16 md:pb-0">
        <div className="mx-auto max-w-[1200px] px-6 py-8">{children}</div>
      </main>
    </div>
  );
}
