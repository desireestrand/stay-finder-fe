"use client";

import { useState } from "react";
import type { SubmitEvent } from "react";
import T from "./typography";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import Link from "next/link";

type AuthFormProps = {
  mode: "login" | "signup";
};

export default function AuthForm({ mode }: AuthFormProps) {
  const auth = useAuth();
  const router = useRouter();
  const [error, setError] = useState<string>();
  const [pending, setPending] = useState(false);

  const handleSubmit = async (event: SubmitEvent<HTMLFormElement>) => {
    event.preventDefault();

    setError(undefined);
    setPending(true);

    const formData = new FormData(event.currentTarget);
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
    <main>
      <form onSubmit={handleSubmit}>
        <T.Header>{isLogin ? "Log in" : "Create account"}</T.Header>

        <div>
          <label>Email</label>
          <input name="email" type="email" placeholder="Enter email" required />
        </div>

        <div>
          <label>Password</label>
          <input
            name="password"
            type="password"
            placeholder="Enter password (minimum 6 characters)"
            required
          />
        </div>

        <button type="submit" disabled={pending}>
          {pending ? "Please wait..." : isLogin ? "Log in" : "Sign up"}
        </button>

        {error && <p className="text-sm text-red-500">{error}</p>}
      </form>

      <div>
        {isLogin ? (
          <p>
            Don't have an account? <Link href="/auth/signup">Sign up</Link>
          </p>
        ) : (
          <p>
            Already have an account? <Link href="/auth/login">Log in</Link>
          </p>
        )}
      </div>
    </main>
  );
}
