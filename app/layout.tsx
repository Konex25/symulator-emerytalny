import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "@/components/ThemeProvider";
import ThemeToggle from "@/components/ThemeToggle";

export const metadata: Metadata = {
  title: "Symulator Emerytalny ZUS",
  description: "Oblicz swoją przyszłą emeryturę - edukacyjne narzędzie Zakładu Ubezpieczeń Społecznych",
  keywords: ["emerytura", "ZUS", "symulator", "kalkulator emerytalny", "przyszła emerytura"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pl">
      <body className="bg-gray-50 dark:bg-gray-900 transition-colors duration-300 relative">
        {/* Floating background circles */}
        <div className="floating-bg">
          <div className="floating-circle floating-circle-1" />
          <div className="floating-circle floating-circle-2" />
          <div className="floating-circle floating-circle-3" />
        </div>
        
        <ThemeProvider>
        <header className="bg-zus-green dark:bg-zus-darkblue text-white shadow-md transition-colors duration-300 relative z-10">
          <div className="container mx-auto px-4 py-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl md:text-3xl font-bold">
                  Symulator Emerytalny
                </h1>
                <p className="text-sm md:text-base opacity-90 mt-1">
                  Zakład Ubezpieczeń Społecznych
                </p>
              </div>
              <div className="flex items-center gap-4">
                <ThemeToggle />
                <div className="hidden md:block">
                  <div className="glass-card px-4 py-2 rounded-lg">
                    <span className="text-xs font-semibold">
                      Edukacja Społeczna
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </header>
        
        <main className="min-h-screen">
          {children}
        </main>
        
        <footer className="bg-zus-darkblue dark:bg-black text-white py-8 mt-16 transition-colors duration-300">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div>
                <h3 className="font-bold text-lg mb-3">O Symulatorze</h3>
                <p className="text-sm opacity-90">
                  Narzędzie edukacyjne ZUS pomagające w planowaniu przyszłości emerytalnej.
                </p>
              </div>
              <div>
                <h3 className="font-bold text-lg mb-3">Kontakt</h3>
                <p className="text-sm opacity-90">
                  Zakład Ubezpieczeń Społecznych<br />
                  ul. Szamocka 3, 5, 01-748 Warszawa
                </p>
              </div>
              <div>
                <h3 className="font-bold text-lg mb-3">Informacje</h3>
                <p className="text-sm opacity-90">
                  © 2025 ZUS. Wszystkie prawa zastrzeżone.<br />
                  Zgodność z WCAG 2.0
                </p>
              </div>
            </div>
          </div>
        </footer>
        </ThemeProvider>
      </body>
    </html>
  );
}

