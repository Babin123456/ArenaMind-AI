import type { Metadata } from "next";
import "./globals.css";
import "./motion.css";
import { Providers } from "@/components/providers";

export const metadata: Metadata = { title: "ArenaMind AI | Operations Center", description: "AI stadium operations command platform" };

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body><a className="skip" href="#main">Skip to main content</a><Providers>{children}</Providers></body></html>;
}
