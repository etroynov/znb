"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function LoginPage() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const form = new FormData(e.currentTarget);
    const data = {
      email: form.get("email"),
      password: form.get("password"),
    };

    try {
      const res = await fetch("/api/jewelers/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
        credentials: "include",
      });

      if (!res.ok) {
        const err = await res.json();
        setError(err.message || err.errors?.[0]?.message || "Invalid credentials");
        return;
      }

      router.push("/moje-konto");
    } catch {
      setError("Connection error. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-md mx-auto">
      <h1 className="text-2xl font-bold mb-6">Logowanie</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="email" className="block text-sm font-medium mb-1">
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            className="w-full border rounded-lg px-3 py-2"
          />
        </div>

        <div>
          <label htmlFor="password" className="block text-sm font-medium mb-1">
            Password
          </label>
          <input
            id="password"
            name="password"
            type="password"
            required
            className="w-full border rounded-lg px-3 py-2"
          />
          <div className="text-right mt-1">
            <span className="text-xs text-gray-400">
              Forgot password? Contact admin
            </span>
          </div>
        </div>

        {error ? (
          <p className="text-red-600 text-sm">{error}</p>
        ) : null}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-black text-white rounded-lg px-4 py-2 disabled:opacity-50"
        >
          {loading ? "Logging in..." : "Log in"}
        </button>
      </form>

      <p className="mt-4 text-sm text-center text-gray-500">
        Don't have an account?{" "}
        <Link href="/rejestracja" className="text-black underline">
          Register
        </Link>
      </p>
    </div>
  );
}
