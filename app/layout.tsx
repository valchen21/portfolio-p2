import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Alex Carter — Product · Design · Strategy",
  description:
    "Builder at the intersection of product thinking, creative direction, and go-to-market strategy.",
  openGraph: {
    title: "Alex Carter — Portfolio",
    description: "Product · Design · Strategy",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className="bg-[#0A0908] text-[#F5EFE8] antialiased overflow-x-hidden">
        {/* Noise texture overlay */}
        <div className="noise-overlay" aria-hidden="true" />
        {children}
      </body>
    </html>
  );
}
