import type { Metadata } from "next";
import { Inter, Manrope } from "next/font/google";
import "./globals.css";

const inter = Inter({ variable: "--font-inter", subsets: ["latin"], display: "swap" });
const manrope = Manrope({ variable: "--font-manrope", subsets: ["latin"], display: "swap" });

export const metadata: Metadata = {
  metadataBase: new URL("https://luizlimamoveis.com.br"),
  title: {
    default: "Luiz Lima Móveis | Móveis Planejados em Florianópolis",
    template: "%s | Luiz Lima Móveis",
  },
  description:
    "Móveis planejados, montagem, desmontagem, adaptações, reparos e instalação de TVs em Florianópolis. Mais de 2.500 atendimentos desde 2015.",
  keywords: [
    "móveis planejados Florianópolis",
    "montador de móveis Florianópolis",
    "marceneiro Florianópolis",
    "instalação de TV Florianópolis",
    "Luiz Lima Móveis",
  ],
  authors: [{ name: "Luiz Lima Móveis" }],
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "pt_BR",
    url: "/",
    siteName: "Luiz Lima Móveis",
    title: "Luiz Lima Móveis | Acabamento profissional em Florianópolis",
    description: "Móveis planejados, montagem e instalações com qualidade, rapidez e mais de 10 anos de experiência.",
    images: [{ url: "/og.png", width: 1200, height: 630, alt: "Luiz Lima Móveis — móveis planejados e instalações" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Luiz Lima Móveis",
    description: "Móveis planejados e instalações com acabamento profissional.",
    images: ["/og.png"],
  },
  robots: { index: true, follow: true },
};

const schema = {
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  name: "Luiz Lima Móveis",
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
