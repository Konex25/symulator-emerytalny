import type { Metadata } from "next";
import "./globals.css";
import ThemeScript from "@/components/ThemeScript";
import Header from "@/components/Header";

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
      <head>
        <ThemeScript />
      </head>
      <body className="bg-gray-50 dark:bg-gray-900 transition-colors duration-300 relative flex flex-col min-h-screen">
        {/* Floating background circles */}
        <div className="floating-bg">
          <div className="floating-circle floating-circle-1" />
          <div className="floating-circle floating-circle-2" />
          <div className="floating-circle floating-circle-3" />
        </div>
        
        <Header />
        
        <main className="flex-1">
          {children}
        </main>
        
        <footer className="bg-zus-green text-white py-8 mt-auto">
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
      </body>
    </html>
  );
}

