import { cn } from "@/lib/utils";
import type { PropsWithChildren } from "react";

interface PageContainerProps {
  className?: string;
}

export function PageContainer({ children, className }: PropsWithChildren<PageContainerProps>) {
  return <div className={cn("space-y-6", className)}>{children}</div>;
}
