import type { Metadata } from "next";
import { Inter, Manrope } from "next/font/google";
import "./globals.css";

const inter = Inter({ variable: "--font-inter", subsets: ["latin"], display: "swap" });
const manrope = Manrope({ variable: "--font-manrope", subsets: ["latin"], display: "swap" });

export const metadata: Metadata = {
  metadataBase: new URL("https://luizlimamoveis.com.br"),
  title: {
    default: "Luiz Lima Marcenaria | Móveis Planejados em Florianópolis",
    template: "%s | Luiz Lima Marcenaria",
  },
  description:
    "Marcenaria especializada em móveis planejados, montagem, desmontagem, adaptações e reparos em Florianópolis.",
  keywords: [
    "móveis planejados Florianópolis",
    "montador de móveis Florianópolis",
    "marceneiro Florianópolis",
    "instalação de TV Florianópolis",
    "Luiz Lima Marcenaria",
  ],
  authors: [{ name: "Luiz Lima Marcenaria" }],
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "pt_BR",
    url: "/",
    siteName: "Luiz Lima Marcenaria",
    title: "Luiz Lima Marcenaria | Acabamento profissional em Florianópolis",
    description: "Móveis planejados, montagem e instalações com qualidade, rapidez e mais de 10 anos de experiência.",
    images: [{ url: "/og-marcenaria.png", width: 1200, height: 630, alt: "Luiz Lima Marcenaria — móveis planejados e instalações" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Luiz Lima Marcenaria",
    description: "Móveis planejados e instalações com acabamento profissional.",
    images: ["/og-marcenaria.png"],
  },
  robots: { index: true, follow: true },
};

const schema = {
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  name: "Luiz Lima Marcenaria",
  description: "Móveis planejados, montagem, desmontagem, adaptações, reparos e instalação de TVs.",
  foundingDate: "2015-10-15",
  address: {
    "@type": "PostalAddress",
    streetAddress: "Rua Fabriciano Inácio Monteiro 1112",
    addressLocality: "Florianópolis",
    addressRegion: "SC",
    addressCountry: "BR",
  },
  areaServed: { "@type": "City", name: "Florianópolis" },
  url: "https://luizlimamoveis.com.br",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="pt-BR">
      <body className={`${inter.variable} ${manrope.variable}`}>
        {children}
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      </body>
    </html>
  );
}
