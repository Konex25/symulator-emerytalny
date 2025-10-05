import Link from 'next/link';
import Image from 'next/image';
import ThemeToggle from './ThemeToggle';

export default function Header() {
  return (
    <header className="bg-zus-green text-white shadow-md relative z-10">
      <div className="container mx-auto px-4 py-2">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center gap-4 hover:opacity-80 transition-opacity">
            <Image
              src="/logo.png"
              alt="ZUS Logo"
              width={120}
              height={120}
              className="object-contain h-24 w-auto"
              priority
            />
            <div>
              <h1 className="text-2xl md:text-3xl font-bold">
                Symulator Emerytalny
              </h1>
              <p className="text-sm md:text-base opacity-90 mt-1">
                Zakład Ubezpieczeń Społecznych
              </p>
            </div>
          </Link>
          <div className="flex items-center gap-4">
            <ThemeToggle />
          </div>
        </div>
      </div>
    </header>
  );
}
