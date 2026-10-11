import type { Metadata } from "next";
import "./globals.css";
export const metadata: Metadata = { title: "Sujit Prasad | Lead Data Engineer", description: "Lead Data Engineer building scalable data platforms and reliable analytics systems." };
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) { return <html lang="en" className="scroll-smooth"><head><link rel="preconnect" href="https://fonts.googleapis.com" /><link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" /><link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=Space+Grotesk:wght@500;600&display=swap" rel="stylesheet" /></head><body>{children}</body></html>; }
