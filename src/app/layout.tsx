import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "ESLint Config Generator",
  description: "Generate your perfect ESLint configuration in seconds",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <script src="https://unpkg.com/react-scan/dist/auto.global.js" async />
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/npm/geist-font@latest/dist/fonts.css"
        />
      </head>

      <body className="antialiased overflow-hidden font-sans">
        <main className="min-h-screen overflow-hidden">{children}</main>
      </body>
    </html>
  );
}
