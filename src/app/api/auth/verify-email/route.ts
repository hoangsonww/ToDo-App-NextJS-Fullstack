import { NextResponse } from "next/server";
import { MongoClient } from "mongodb";

// MongoDB configuration
const uri = process.env.MONGO_DB_URI || "";
const client = new MongoClient(uri);
const dbName = "todo-nextjs-app";
const collectionName = "users";

export async function POST(request: Request) {
  const { username } = await request.json();

  // Validate input
  if (!username) {
    return NextResponse.json(
      { error: "Username is required" },
      { status: 400 }
    );
  }

  try {
    // Connect to the database
    await client.connect();
    const db = client.db(dbName);
    const usersCollection = db.collection(collectionName);

    // Find the user by username
    const user = await usersCollection.findOne({ username });

    // Check if the user exists
    if (!user) {
      return NextResponse.json(
        { error: "Username not found" },
        { status: 404 }
      );
    }

    // Return success response
    return NextResponse.json(
      { message: "Username exists", user: { id: user._id, username: user.username } },
      { status: 200 }
    );
  } catch (error) {
    console.error("Database connection error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  } finally {
    // Ensure the database connection is closed
    await client.close();
  }
}
