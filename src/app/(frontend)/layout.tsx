import Link from 'next/link';
import Script from 'next/script';
import './global.css';

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
      </head>
      <body>
        <header className="border-b border-gray-300">
          <div className="container mx-auto py-4 flex items-center justify-between">
            <Link href="/" className="text-3xl">
              Jubilerzy
            </Link>
            <nav className="flex gap-4 text-sm">
              <Link href="/logowanie" className="hover:underline">
                Log in
              </Link>
              <Link href="/rejestracja" className="hover:underline">
                Register
              </Link>
              <Link href="/moje-konto" className="hover:underline">
                My profile
              </Link>
              <Link href="/wyloguj" className="hover:underline">
                Log out
              </Link>
            </nav>
          </div>
        </header>

        <main className="container mx-auto pt-6 min-h-[60vh]">{props.children}</main>

        <footer className="border-t border-gray-200 mt-16 py-8">
          <div className="container mx-auto text-center text-sm text-gray-500">
            <p className="mb-2">
              Znajdź Jubilera — katalog jubilerów w Polsce
            </p>
            <p>
              &copy; {new Date().getFullYear()} Znajdź Jubilera
            </p>
          </div>
        </footer>
      </body>
    </html>
  );
}
