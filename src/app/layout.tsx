import type { Metadata } from "next";
import { IBM_Plex_Mono, Space_Grotesk } from "next/font/google";
import "./globals.css";

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  weight: ["400", "600", "700"],
  variable: "--font-space-grotesk",
});

const ibmPlexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-ibm-plex-mono",
});

export const metadata: Metadata = {
  title: "Ashish Jha | Full-Stack Developer",
  description:
    "Portfolio and contact hub for Ashish Jha, a full-stack engineer building reliable products.",
  icons: {
    icon: [
      { url: "/faviconx32.ico", sizes: "32x32", type: "image/x-icon" },
      { url: "/faviconx64.ico", sizes: "64x64", type: "image/x-icon" },
    ],
    shortcut: "/faviconx32.ico",
    apple: "/faviconx64.ico",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${spaceGrotesk.variable} ${ibmPlexMono.variable}`}
    >
      <body className={spaceGrotesk.className}>
        {children}
      </body>
    </html>
  );
}
