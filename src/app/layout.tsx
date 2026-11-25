import type { Metadata } from "next";
import localFont from "next/font/local";
import { Providers } from "./providers";
import "./globals.css";

const onest = localFont({
  variable: "--font-onest",
  display: "swap",
  src: [
    { path: "./fonts/onest-v11-latin-regular.woff2", weight: "400", style: "normal" },
    { path: "./fonts/onest-v11-latin-500.woff2", weight: "500", style: "normal" },
    { path: "./fonts/onest-v11-latin-600.woff2", weight: "600", style: "normal" },
  ],
});

export const metadata: Metadata = {
  title: "YolUp Admin",
  description: "YolUp ta’lim platformasi statistikasi",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="uz" className={onest.variable}>
      <body className="min-h-dvh">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
