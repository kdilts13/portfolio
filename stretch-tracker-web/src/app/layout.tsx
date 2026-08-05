import "./global.css";

import { cn } from "@/lib/utils";
import { Geist } from "next/font/google";

import { Providers } from "./providers";

const geist = Geist({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata = {
  title: "Stretch Tracker",
  description: "Track stretching and mobility routines.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={cn("font-sans", geist.variable)}>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
