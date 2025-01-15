import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Age Verification",
  description: "Verify your age using Archipels",
  icons: {
    icon: "/legal-age-check/archipels.ico"
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
