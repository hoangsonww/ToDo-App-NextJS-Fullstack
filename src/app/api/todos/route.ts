import { NextResponse } from "next/server";
import { MongoClient } from "mongodb";
import { TodoItem, TodoPriority } from "@/types/todo";

// MongoDB Configuration
const uri = process.env.MONGO_DB_URI || "";
const client = new MongoClient(uri);
const dbName = "todo-nextjs-app";
const collectionName = "users";

// Interfaces for type safety
interface UserDocument {
  userId: string;
  todos: TodoItem[];
}

// POST: Add a new todo
export async function POST(request: Request) {
  const { userId, task, category, completed, priority, dueDate, notes } =
    await request.json();

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

    const newTodo: TodoItem = {
      id: Date.now(),
      userId,
      task,
      category,
      completed: Boolean(completed),
      priority: (priority as TodoPriority) || "medium",
      dueDate: dueDate || "",
      notes: notes || "",
      createdAt: Date.now(),
    };

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

    const todosWithDefaults: TodoItem[] = (user?.todos || []).map((todo) => ({
      ...todo,
      priority: todo.priority || "medium",
      dueDate: todo.dueDate || "",
      notes: todo.notes || "",
      createdAt: todo.createdAt || todo.id || Date.now(),
    }));

    return NextResponse.json(todosWithDefaults, { status: 200 });
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

    const normalizedTodoId =
      typeof todoId === "string" ? parseInt(todoId, 10) : todoId;

    const updateResult = await usersCollection.updateOne(
      { userId, "todos.id": normalizedTodoId },
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

// PUT: Update core fields for a todo
export async function PUT(request: Request) {
  const {
    userId,
    todoId,
    task,
    category,
    priority,
    dueDate,
    notes,
    completed,
  } = await request.json();

  if (!userId || !todoId) {
    return NextResponse.json(
      { error: "User ID and Todo ID are required" },
      { status: 400 },
    );
  }

  const updateFields: Record<string, unknown> = {};

  if (task !== undefined) updateFields["todos.$.task"] = task;
  if (category !== undefined) updateFields["todos.$.category"] = category;
  if (priority !== undefined) updateFields["todos.$.priority"] = priority;
  if (dueDate !== undefined) updateFields["todos.$.dueDate"] = dueDate;
  if (notes !== undefined) updateFields["todos.$.notes"] = notes;
  if (completed !== undefined) updateFields["todos.$.completed"] = completed;

  if (Object.keys(updateFields).length === 0) {
    return NextResponse.json(
      { error: "No update fields provided" },
      { status: 400 },
    );
  }

  try {
    await client.connect();
    const db = client.db(dbName);
    const usersCollection = db.collection<UserDocument>(collectionName);

    const normalizedTodoId =
      typeof todoId === "string" ? parseInt(todoId, 10) : todoId;

    const updateResult = await usersCollection.updateOne(
      { userId, "todos.id": normalizedTodoId },
      { $set: updateFields },
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

    const normalizedTodoId =
      typeof todoId === "string" ? parseInt(todoId, 10) : todoId;

    const deleteResult = await usersCollection.updateOne(
      { userId },
      { $pull: { todos: { id: normalizedTodoId } } },
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
