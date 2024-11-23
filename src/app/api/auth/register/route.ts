// src/app/api/auth/register/route.ts
import { NextResponse } from "next/server";

interface User {
  id: number;
  username: string;
  password: string;
}

const users: User[] = []; // In-memory user storage
let userIdCounter = 1;

export async function POST(request: Request) {
  const { username, password } = await request.json();

  // Validate input
  if (!username || !password) {
    return NextResponse.json(
      { error: "Username and password are required" },
      { status: 400 },
    );
  }

  // Check if user already exists
  if (users.find((user) => user.username === username)) {
    return NextResponse.json({ error: "User already exists" }, { status: 400 });
  }

  // Create new user without encryption
  const newUser: User = { id: userIdCounter++, username, password };
  users.push(newUser);

  return NextResponse.json(
    {
      message: "User registered successfully",
      user: { id: newUser.id, username },
    },
    { status: 201 },
  );
}
