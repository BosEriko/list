import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Anime and Manga Listing",
  description: "Save your anime and manga!",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
