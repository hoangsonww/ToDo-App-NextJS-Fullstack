// src/app/api/auth/login/route.ts
import { NextResponse } from "next/server";

interface User {
  id: number;
  username: string;
  password: string;
}

const users: User[] = []; // In-memory user storage shared across requests

export async function POST(request: Request) {
  const { username, password } = await request.json();

  // Validate input
  if (!username || !password) {
    return NextResponse.json(
      { error: "Username and password are required" },
      { status: 400 },
    );
  }

  // Find the user
  const user = users.find((user) => user.username === username);

  // Validate user credentials
  if (!user || user.password !== password) {
    return NextResponse.json(
      { error: "Invalid username or password" },
      { status: 401 },
    );
  }

  return NextResponse.json(
    { message: "Login successful", user: { id: user.id, username } },
    { status: 200 },
  );
}
