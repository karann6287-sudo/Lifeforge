import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface MainProps {
  children: ReactNode;
  className?: string;
}

export function Main({ children, className }: MainProps) {
  return (
    <main id="main-content" className={cn("flex-1", className)}>
      {children}
    </main>
  );
}