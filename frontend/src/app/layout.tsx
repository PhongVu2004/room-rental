import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { Navbar } from "@/components/Navbar";
import { AuthProvider } from "@/context/auth-context";
import { Toaster } from "react-hot-toast";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: {
    default: "Room Rental Platform | Find Your Perfect Space",
    template: "%s | Room Rental"
  },
  description: "Experience the modern way to rent. Fast, secure, and beautifully designed for both tenants and landlords.",
  keywords: ["room rental", "apartments", "housing", "student accommodation", "renting"],
  authors: [{ name: "Room Rental Team" }],
  openGraph: {
    title: "Room Rental Platform",
    description: "Find your next home easily. Meticulously verified rooms, smart filters, and real reviews.",
    url: "https://roomrental.com",
    siteName: "Room Rental Platform",
    images: [
      {
        url: "https://via.placeholder.com/1200x630?text=Room+Rental+Platform",
        width: 1200,
        height: 630,
      }
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Room Rental Platform",
    description: "Find your next home easily. Meticulously verified rooms, smart filters, and real reviews.",
    images: ["https://via.placeholder.com/1200x630?text=Room+Rental+Platform"],
  },
  manifest: "/manifest.json",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <AuthProvider>
            <div className="flex min-h-screen flex-col">
              <Navbar />
              <main className="flex-1">{children}</main>
            </div>
            <Toaster position="bottom-right" />
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
