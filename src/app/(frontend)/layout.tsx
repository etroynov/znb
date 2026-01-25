import Link from 'next/link';
import Script from 'next/script';
import './global.css';

export default async function RootLayout(props: { children: React.ReactNode }) {
  return (
    <html lang="ru">
      <head>
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-64ZCEW9NXW"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-64ZCEW9NXW');
          `}
        </Script>
      </head>
      <body>
        <header className="border-b border-gray-300">
          <div className="container mx-auto py-4">
            <Link href="/" className="block text-3xl">
              Кройка и шитье
            </Link>
          </div>
        </header>

        <main className="container mx-auto pt-6">{props.children}</main>
      </body>
    </html>
  );
}
