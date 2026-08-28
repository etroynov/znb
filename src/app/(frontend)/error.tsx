'use client';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="text-center py-20">
      <h1 className="text-4xl font-bold mb-4">Coś poszło nie tak</h1>
      <p className="text-gray-500 mb-8">
        Przepraszamy, wystąpił błąd. Spróbuj odświeżyć stronę.
      </p>
      <button
        onClick={() => reset()}
        className="bg-black text-white rounded-lg px-6 py-2"
      >
        Spróbuj ponownie
      </button>
    </div>
  );
}