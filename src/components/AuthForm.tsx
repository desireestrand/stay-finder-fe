"use client";

import { useAuth } from "@/contexts/AuthContext";
import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import type { SubmitEvent } from "react";
import ErrorMessage from "./ErrorMessage";
import Link from "next/link";
import T from "./typography";

interface AuthFormProps {
  mode: "login" | "signup";
}

export default function AuthForm({ mode }: AuthFormProps) {
  const auth = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();

  const redirectTo = searchParams.get("redirectTo") || "/";

  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  const handleSubmit = async (e: SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();

    setError(null);
    setPending(true);

    const formData = new FormData(e.currentTarget);
    const email = String(formData.get("email")).trim();
    const password = String(formData.get("password"));

    try {
      if (mode === "login") {
        await auth.login(email, password);
      } else {
        await auth.signup(email, password);
      }

      router.push(redirectTo);
      router.refresh();
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Authentication failed";
      setError(message);
    } finally {
      setPending(false);
    }
  };

  const isLogin = mode === "login";

  return (
    <div className="flex flex-1 items-center justify-center px-4 py-12">
      <div className="w-full max-w-md rounded-2xl border border-gray-200 bg-white p-8">
        <form noValidate onSubmit={handleSubmit} className="space-y-6">
          <div className="text-center">
            <T.Header size="lg">
              {isLogin ? "Log in to StayFinder" : "Create an account"}
            </T.Header>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                E-mail
              </label>

              <input
                name="email"
                type="email"
                placeholder="name@example.com"
                required
                className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-400 focus:border-black focus:outline-none focus:ring-1 focus:ring-black sm:text-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Password
              </label>

              <input
                name="password"
                type="password"
                placeholder="Minimum 6 characters"
                required
                className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-400 focus:border-black focus:outline-none focus:ring-1 focus:ring-black sm:text-sm"
              />
            </div>
          </div>

          <ErrorMessage message={error} />

          <button
            type="submit"
            disabled={pending}
            className="w-full rounded-lg bg-black px-4 py-2.5 text-sm font-semibold text-white hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2 disabled:opacity-50 transition-colors"
          >
            {pending ? "Loading..." : isLogin ? "Log in" : "Sign up"}
          </button>
        </form>

        <div className="mt-6 text-center text-sm text-gray-600">
          {isLogin ? (
            <p>
              Don't have an account?{" "}
              <Link
                href="/auth/signup"
                className="font-medium text-black underline hover:text-gray-700"
              >
                Sign up
              </Link>
            </p>
          ) : (
            <p>
              Already have an account?{" "}
              <Link
                href="/auth/login"
                className="font-medium text-black underline hover:text-gray-700"
              >
                Log in
              </Link>
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
