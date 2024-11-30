import { NextResponse } from "next/server";
import { MongoClient } from "mongodb";

interface User {
  username: string;
  password: string;
}

const uri = process.env.MONGO_DB_URI;

if (!uri) {
  throw new Error("Please define the MONGO_DB_URI environment variable");
}

// Function to connect to MongoDB
async function connectToDatabase() {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-expect-error
  const client = new MongoClient(uri);
  await client.connect();
  return client.db("todo-nextjs-app"); // Replace with your actual database name
}

export async function POST(request: Request) {
  const { username, password }: User = await request.json();

  // Validate input
  if (!username || !password) {
    return NextResponse.json(
      { error: "Username and password are required" },
      { status: 400 },
    );
  }

  try {
    const db = await connectToDatabase();
    const usersCollection = db.collection("users");

    // Check if user already exists
    const existingUser = await usersCollection.findOne({ username });
    if (existingUser) {
      return NextResponse.json(
        { error: "User already exists" },
        { status: 400 },
      );
    }

    // Create a new user
    const newUser = { username, password }; // Note: Password is not hashed (not secure)
    const result = await usersCollection.insertOne(newUser);

    if (result.acknowledged) {
      return NextResponse.json(
        { message: "User registered successfully", user: { username } },
        { status: 201 },
      );
    } else {
      return NextResponse.json(
        { error: "Failed to register user" },
        { status: 500 },
      );
    }
  } catch (error) {
    console.error("Error during user registration:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
