import type { Metadata } from "next";
import { Raleway } from "next/font/google";
import "../globals.css";

const raleway = Raleway({
  subsets: ["latin"],
  variable: "--font-raleway",
});

export const metadata: Metadata = {
  title: "Admin | Salon Arias",
  robots: "noindex, nofollow", // Prevent search engines from indexing the admin panel
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${raleway.variable} antialiased font-sans text-base`}>
        {children}
      </body>
    </html>
  );
}
