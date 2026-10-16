"use client";

import { useState } from "react";
import type {SubmitEvent} from "react"
import T from "./typography";
import { useAuth } from "@/contexts/auth";
import { useRouter } from "next/navigation";

export default function AuthForm() {
    const auth = useAuth()
    const router = useRouter()
  const [error, setError] = useState<string>();
  const [pending, setPending] = useState(false);

  const login = async (event: SubmitEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const email = String(formData.get("email")).trim();
    const password = String(formData.get("password"));
    setError(undefined);
    setPending(true);
    const response = await auth.login(email, password)
    setPending(false)
    if(typeof response === "string") {
        setError(response)
        return;
    }
    router.push("/")
  }

  return (
    <form onSubmit={login}>
      <T.Header>Log in</T.Header>
      <input name="email" type="email" placeholder="Enter email" required />
      <input name="password" type="password" placeholder="Enter Password" required />
      <button type="submit" disabled={pending}>Log in</button>
      {error && (
        <p className="text-red-500">{error}</p>
      )}
    </form>
  );
}