import { NextResponse } from "next/server";
import { MongoClient } from "mongodb";

// Connect to MongoDB
const uri = process.env.MONGO_DB_URI || "";
const client = new MongoClient(uri);
const dbName = "todo-nextjs-app";
const collectionName = "users";

export async function POST(request: Request) {
  const { username, password } = await request.json();

  // Validate input
  if (!username || !password) {
    return NextResponse.json(
      { error: "Username and password are required" },
      { status: 400 },
    );
  }

  try {
    // Connect to the database
    await client.connect();
    const db = client.db(dbName);
    const usersCollection = db.collection(collectionName);

    // Find the user
    const user = await usersCollection.findOne({ username });

    // Validate user credentials
    if (!user || user.password !== password) {
      return NextResponse.json(
        { error: "Invalid username or password" },
        { status: 401 },
      );
    }

    // Return success response
    return NextResponse.json(
      { message: "Login successful", user: { id: user._id, username } },
      { status: 200 },
    );
  } catch (error) {
    console.error("Database connection error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  } finally {
    // Close the database connection
    await client.close();
  }
}
