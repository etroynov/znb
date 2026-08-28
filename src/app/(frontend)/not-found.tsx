import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="text-center py-20">
      <h1 className="text-6xl font-bold mb-4">404</h1>
      <p className="text-xl text-gray-500 mb-2">Nie znaleziono strony</p>
      <p className="text-gray-400 mb-8">
        Strona, której szukasz, nie istnieje lub została usunięta.
      </p>
      <Link
        href="/"
        className="inline-block bg-black text-white rounded-lg px-6 py-2"
      >
        Wróć do katalogu
      </Link>
    </div>
  );
}