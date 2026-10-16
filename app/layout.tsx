import type { Metadata } from "next";
import { Inter, Space_Grotesk } from "next/font/google";
import "./globals.css";
import { siteConfig } from "@/lib/portfolio-data";
import { Nav } from "@/components/nav";

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-inter",
  display: "swap",
});

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  weight: ["500", "600"],
  variable: "--font-space-grotesk",
  display: "swap",
});

const description =
  "Lead Data Engineer with 9+ years building lakehouse platforms, API ingestion and Spark pipelines on AWS and Azure.";

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: { default: "Sujit Prasad | Lead Data Engineer", template: "%s | Sujit Prasad" },
  description,
  openGraph: {
    title: "Sujit Prasad | Lead Data Engineer",
    description,
    url: siteConfig.url,
    siteName: "Sujit Prasad",
    type: "website",
    images: [{ url: "/og.svg", width: 1200, height: 630, alt: "Sujit Prasad | Lead Data Engineer" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Sujit Prasad | Lead Data Engineer",
    description,
    images: ["/og.svg"],
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: siteConfig.name,
  jobTitle: siteConfig.role,
  url: siteConfig.url,
  sameAs: [siteConfig.linkedin, siteConfig.github],
  address: {
    "@type": "PostalAddress",
    addressLocality: "Bengaluru",
    addressCountry: "IN",
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`scroll-smooth ${inter.variable} ${spaceGrotesk.variable}`}>
      <body className="font-sans antialiased">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded focus:bg-violet-600 focus:px-3 focus:py-2"
        >
          Skip to content
        </a>
        <Nav />
        {children}
      </body>
    </html>
  );
}
