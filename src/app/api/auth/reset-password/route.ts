import { NextResponse } from "next/server";
import { MongoClient } from "mongodb";

// MongoDB configuration
const uri = process.env.MONGO_DB_URI || "";
const client = new MongoClient(uri);
const dbName = "todo-nextjs-app";
const collectionName = "users";

export async function POST(request: Request) {
  const { username, newPassword } = await request.json();

  if (!username || !newPassword) {
    return NextResponse.json(
      { error: "username and new password are required" },
      { status: 400 }
    );
  }

  try {
    await client.connect();
    const db = client.db(dbName);
    const usersCollection = db.collection(collectionName);

    const user = await usersCollection.findOne({ username });

    if (!user) {
      return NextResponse.json(
        { error: "Username not found" },
        { status: 404 }
      );
    }

    // Update the user's password
    await usersCollection.updateOne(
      { username },
      { $set: { password: newPassword } }
    );

    return NextResponse.json(
      { message: "Password reset successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error resetting password:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  } finally {
    await client.close();
  }
}
