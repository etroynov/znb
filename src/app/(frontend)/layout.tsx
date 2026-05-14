import Link from 'next/link';
import Script from 'next/script';
import './global.css';
import { HeaderSearch } from './_components/HeaderSearch';

export default async function RootLayout(props: { children: React.ReactNode }) {
  return (
    <html lang="pl">
      <head>
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-SP23XSNY6E"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-SP23XSNY6E');
          `}
        </Script>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'Organization',
              name: 'Znajdź Jubilera',
              url: 'https://znajdzjubilera.pl',
              description:
                'Katalog zaufanych studiów i sklepów jubilerskich w Polsce',
              areaServed: 'PL',
            }),
          }}
        />
      </head>
      <body>
        <header className="border-b border-gray-300">
          <div className="container mx-auto py-4 flex items-center justify-between gap-4">
            <Link href="/" className="text-2xl font-bold shrink-0">
              Znajdź Jubilera
            </Link>

            <div className="flex-1 max-w-xs">
              <HeaderSearch />
            </div>

            <nav className="flex items-center gap-4 text-sm shrink-0">
              <Link href="/events" className="hover:underline text-gray-600">
                Wydarzenia
              </Link>
              <Link
                href="/dla-jubilerow"
                className="hover:underline text-gray-600"
              >
                Dla jubilerów
              </Link>
              <Link
                href="/logowanie"
                className="bg-black text-white px-4 py-2 rounded-lg text-sm hover:bg-gray-800"
              >
                Zaloguj się
              </Link>
            </nav>
          </div>
        </header>

        <main className="container mx-auto pt-6 min-h-[60vh]">
          {props.children}
        </main>

        <footer className="border-t border-gray-200 mt-16 py-8">
          <div className="container mx-auto text-center text-sm text-gray-500">
            <p className="mb-2">Znajdź Jubilera — katalog jubilerów w Polsce</p>
            <p>&copy; {new Date().getFullYear()} Znajdź Jubilera</p>
          </div>
        </footer>
      </body>
    </html>
  );
}