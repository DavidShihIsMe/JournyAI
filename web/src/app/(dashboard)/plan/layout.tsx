import type { ReactNode } from "react";
import { PlanProvider } from "./_components/PlanContext";

export default function PlanLayout({ children }: { children: ReactNode }) {
  return <PlanProvider>{children}</PlanProvider>;
}
