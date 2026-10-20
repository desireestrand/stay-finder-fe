"use client";

import { useAuth } from "@/contexts/AuthContext";
import { useState } from "react";
import type { SubmitEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import T from "./typography";

type AuthFormProps = {
  mode: "login" | "signup";
};

export default function AuthForm({ mode }: AuthFormProps) {
  const auth = useAuth();
  const router = useRouter();

  const [error, setError] = useState<string>();
  const [pending, setPending] = useState(false);

  const handleSubmit = async (e: SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();

    setError(undefined);
    setPending(true);

    const formData = new FormData(e.currentTarget);
    const email = String(formData.get("email")).trim();
    const password = String(formData.get("password"));

    let response: void | string;

    if (mode === "login") {
      response = await auth.login(email, password);
    } else {
      response = await auth.signup(email, password);
    }

    setPending(false);

    if (typeof response === "string") {
      setError(response);

      return;
    }

    router.push("/");
  };

  const isLogin = mode === "login";

  return (
    <main className="flex min-h-[80vh] flex-col items-center justify-center px-4 py-12">
      <div className="w-full max-w-md rounded-2xl border border-gray-200 bg-white p-8 shadow-sm">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="text-center">
            <T.Header className="text-2xl font-bold tracking-tight text-gray-900">
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
                className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-400 shadow-sm focus:border-black focus:outline-none focus:ring-1 focus:ring-black sm:text-sm"
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
                className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-400 shadow-sm focus:border-black focus:outline-none focus:ring-1 focus:ring-black sm:text-sm"
              />
            </div>
          </div>

          {error && (
            <div className="rounded-lg bg-red-50 p-3 text-sm text-red-600 border border-red-200">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={pending}
            className="w-full rounded-lg bg-black px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2 disabled:opacity-50 transition-colors"
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
    </main>
  );
}