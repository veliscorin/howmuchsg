import "./globals.css";
import { Cormorant_Garamond, Fira_Sans } from "next/font/google";

// Import Cormorant Garamond Bold Italic
const cormorantGaramond = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["700"], // 700 is for bold
  style: ["italic"], // Italic style
});

// Import Fira Sans Regular
const firaSans = Fira_Sans({
  subsets: ["latin"],
  weight: ["400"], // 400 is for regular
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={firaSans.className}>{children}</body>
    </html>
  );
}