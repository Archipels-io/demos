import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Identity verification required",
  description: "Archipels wallet identity checkdemo",
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
