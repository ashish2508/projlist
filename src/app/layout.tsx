import { Atmosphere } from "@/components/atmosphere";
import { getSoundtrack } from "@/lib/soundtrack";
import type { Metadata } from "next";
import "@fontsource/space-grotesk/latin-400.css";
import "@fontsource/space-grotesk/latin-600.css";
import "@fontsource/space-grotesk/latin-700.css";
import "@fontsource/ibm-plex-mono/latin-400.css";
import "@fontsource/ibm-plex-mono/latin-500.css";
import "./globals.css";

export const metadata: Metadata = {
  title: "Ashish Jha | Portfolio",
  description: "Explore Ashish Jha’s projects and wallpaper collection under a canopy of cherry blossoms.",
  icons: {
    icon: [
      { url: "/faviconx32.ico", sizes: "32x32", type: "image/x-icon" },
      { url: "/faviconx64.ico", sizes: "64x64", type: "image/x-icon" },
    ],
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return <html lang="en" data-scroll-behavior="smooth"><body>{children}<Atmosphere songs={getSoundtrack()} /></body></html>;
}
