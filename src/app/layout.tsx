import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Stakeholder Translator — AI-Powered Communication Intelligence",
  description:
    "Transform any document into audience-specific communications with full transparency on what changed and why.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  );
}
