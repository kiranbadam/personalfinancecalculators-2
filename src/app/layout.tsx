import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Sidebar } from "@/components/layout/Sidebar";
import { MobileNav } from "@/components/layout/MobileNav";
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <head>
        <title>FinCalc - Personal Finance Calculator Suite</title>
        <meta name="description" content="Professional personal finance calculators: Mortgage, Compound Interest, FIRE Retirement, and Options P/L." />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-zinc-950 min-h-screen`}
      >
        <TooltipProvider>
          <div className="bg-grid min-h-screen">
            <Sidebar />
            <main className="lg:ml-64 min-h-screen pb-20 lg:pb-0">
              <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
                {children}
              </div>
            </main>
            <MobileNav />
          </div>
          <Toaster />
        </TooltipProvider>
      </body>
    </html>
  );
}
