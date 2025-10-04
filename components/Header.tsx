import ThemeToggle from './ThemeToggle';

export default function Header() {
  return (
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
  );
}
