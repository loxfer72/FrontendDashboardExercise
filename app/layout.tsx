import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "../styles/globals.css";
import { Providers } from "./providers";

const geist = Geist({
  subsets:  ["latin"],
  variable: "--font-geist-sans",
});

export const metadata: Metadata = {
  title:       "TechCorp — Internal Tools Dashboard",
  description: "Monitor and manage your organization's software tools and expenses",
  icons: {
    icon: "/favicon.svg",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${geist.variable} font-sans`} suppressHydrationWarning>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}