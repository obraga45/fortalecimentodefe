import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Fortalecimento de Fé",
  description: "Palavras que Fortalecem, Reflexões que Inspiram",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" className="h-full antialiased">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Playfair+Display:ital,wght@0,400;0,500;0,600;0,700;1,400;1,500;1,600;1,700&display=swap"
          rel="stylesheet"
        />
        <style>
          {`
            :root {
              --font-inter: 'Inter', sans-serif;
              --font-playfair-display: 'Playfair Display', serif;
            }
          `}
        </style>
      </head>
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
