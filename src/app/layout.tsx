import type {Metadata} from 'next';
import { Inter, Literata } from 'next/font/google';
import './globals.css';
import { Toaster } from "@/components/ui/toaster";
import { cn } from '@/lib/utils';

const fontInter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
});

const fontLiterata = Literata({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-literata',
});

export const metadata: Metadata = {
  title: 'IndCourtOrder AI',
  description: 'Generate realistic judicial-style legal text with AI.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={cn(
        'font-body antialiased',
        fontInter.variable,
        fontLiterata.variable
      )}>
        {children}
        <Toaster />
      </body>
    </html>
  );
}
