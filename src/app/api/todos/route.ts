import { NextResponse } from "next/server";
import { MongoClient } from "mongodb";

// MongoDB Configuration
const uri = process.env.MONGO_DB_URI || "";
const client = new MongoClient(uri);
const dbName = "todo-nextjs-app";
const collectionName = "users";

// Interfaces for type safety
interface Todo {
  id: number;
  task: string;
  category: string;
  completed: boolean;
}

interface UserDocument {
  userId: string;
  todos: Todo[];
}

// POST: Add a new todo
export async function POST(request: Request) {
  const { userId, task, category, completed } = await request.json();

  if (!userId || !task) {
    return NextResponse.json(
      { error: "User ID and task are required" },
      { status: 400 },
    );
  }

  try {
    // Connect to the database
    await client.connect();
    const db = client.db(dbName);
    const usersCollection = db.collection<UserDocument>(collectionName);

    const newTodo: Todo = { id: Date.now(), task, category, completed };

    // Explicitly structure $push
    const updateResult = await usersCollection.updateOne(
      { userId },
      { $push: { todos: newTodo } },
      { upsert: true },
    );

    return NextResponse.json(
      { message: "Todo added successfully", result: updateResult },
      { status: 201 },
    );
  } catch (error) {
    console.error("Error adding todo:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}

// GET: Fetch todos for a user
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get("userId");

  if (!userId) {
    return NextResponse.json({ error: "User ID is required" }, { status: 400 });
  }

  try {
    await client.connect();
    const db = client.db(dbName);
    const usersCollection = db.collection<UserDocument>(collectionName);

    const user = await usersCollection.findOne({ userId });

    return NextResponse.json(user?.todos || [], { status: 200 });
  } catch (error) {
    console.error("Error fetching todos:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}

// PATCH: Update the completion status of a todo
export async function PATCH(request: Request) {
  const { userId, todoId, completed } = await request.json();

  if (!userId || !todoId) {
    return NextResponse.json(
      { error: "User ID and Todo ID are required" },
      { status: 400 },
    );
  }

  try {
    await client.connect();
    const db = client.db(dbName);
    const usersCollection = db.collection<UserDocument>(collectionName);

    const updateResult = await usersCollection.updateOne(
      { userId, "todos.id": todoId },
      { $set: { "todos.$.completed": completed } },
    );

    return NextResponse.json(
      { message: "Todo updated successfully", result: updateResult },
      { status: 200 },
    );
  } catch (error) {
    console.error("Error updating todo:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}

// DELETE: Remove a todo
export async function DELETE(request: Request) {
  const { userId, todoId } = await request.json();

  if (!userId || !todoId) {
    return NextResponse.json(
      { error: "User ID and Todo ID are required" },
      { status: 400 },
    );
  }

  try {
    await client.connect();
    const db = client.db(dbName);
    const usersCollection = db.collection<UserDocument>(collectionName);

    const deleteResult = await usersCollection.updateOne(
      { userId },
      { $pull: { todos: { id: todoId } } },
    );

    return NextResponse.json(
      { message: "Todo deleted successfully", result: deleteResult },
      { status: 200 },
    );
  } catch (error) {
    console.error("Error deleting todo:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
