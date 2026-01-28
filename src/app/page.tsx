import { CourtOrderGenerator } from '@/components/court-order-generator';
import { ThemeToggle } from '@/components/theme-toggle';
import { Gavel } from 'lucide-react';

export default function Home() {
  return (
    <div className="relative flex min-h-screen w-full flex-col">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center">
          <div className="mr-4 flex items-center gap-2">
            <Gavel className="h-6 w-6 text-primary" />
            <h1 className="text-xl font-bold tracking-tight">IndCourtOrder AI</h1>
          </div>
          <div className="flex flex-1 items-center justify-end">
            <nav className="flex items-center gap-2">
              <ThemeToggle />
            </nav>
          </div>
        </div>
      </header>
      <main className="flex-1">
        <CourtOrderGenerator />
      </main>
    </div>
  );
}
