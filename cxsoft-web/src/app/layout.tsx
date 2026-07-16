import "~/styles/globals.css";

import { type Metadata } from "next";
import { Geist } from "next/font/google";

export const metadata: Metadata = {
  title: "CXSOFT SOLUTIONS — Custom Software Development Philippines",
  description:
    "We build custom web apps, mobile apps, POS systems, and business automation tools for Philippine businesses. Get a free quote today.",
  icons: [
    { rel: "icon", url: "/cxsoftlogo.png" },
    { rel: "apple-touch-icon", url: "/cxsoftlogo.png" },
  ],
};

const geist = Geist({
  subsets: ["latin"],
  variable: "--font-geist-sans",
});

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${geist.variable}`}>
      <body className="min-h-screen bg-slate-50 font-sans antialiased">
        {children}
      </body>
    </html>
  );
}
