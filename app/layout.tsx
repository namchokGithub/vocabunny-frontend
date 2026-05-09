import "./globals.css";
import type { Metadata } from "next";
import type { ReactNode } from "react";
import { ToastProvider } from "@/components/ui/toast";

export const metadata: Metadata = {
  title: "VocabBunny BO",
  description:
    "Back Office admin panel for VocabBunny internal staff operations.",
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        <ToastProvider>{children}</ToastProvider>
      </body>
    </html>
  );
}
