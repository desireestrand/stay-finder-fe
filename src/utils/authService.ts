import { parseErrorResponse } from "./error";

export async function login(
  email: string,
  password: string,
): Promise<true | string> {
  const url = new URL(`${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/login`);

  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify({
      email,
      password,
    }),
  });

  if (!response.ok) {
    return await parseErrorResponse(response, "Invalid credentials");
  }

  return true;
}

export async function signup(
  email: string,
  password: string,
): Promise<true | string> {
  const url = new URL(`${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/register`);

  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify({ email, password }),
  });

  if (!response.ok) {
    return await parseErrorResponse(response, "Failed to register account");
  }

  return true;
}

export async function logout(): Promise<boolean> {
  const url = new URL(`${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/logout`);

  const response = await fetch(url, {
    method: "POST",
    credentials: "include",
  });

  return response.ok;
}

export async function getMe(): Promise<AuthUser | null> {
  const url = new URL(`${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/me`);

  const response = await fetch(url, {
    method: "GET",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    return null;
  }

  const data = await response.json();

  return (data?.user || data) as AuthUser | null;
}
