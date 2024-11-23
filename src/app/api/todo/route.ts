// src/app/api/todos/route.ts
import { NextResponse } from "next/server";

interface Todo {
  id: number;
  userId: number;
  task: string;
  category: string;
  completed: boolean;
}

let todos: Todo[] = [];
let currentTodoId = 1;

export async function GET(request: Request) {
  const userId = request.headers.get("user-id");
  if (!userId)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const userTodos = todos.filter((todo) => todo.userId === parseInt(userId));
  return NextResponse.json(userTodos);
}

export async function POST(request: Request) {
  const { task, category } = await request.json();
  const userId = request.headers.get("user-id");

  if (!userId || !task || !category) {
    return NextResponse.json(
      { error: "Unauthorized or invalid data" },
      { status: 400 },
    );
  }

  const newTodo: Todo = {
    id: currentTodoId++,
    userId: parseInt(userId),
    task,
    category,
    completed: false,
  };
  todos.push(newTodo);

  return NextResponse.json(newTodo, { status: 201 });
}

export async function PUT(request: Request) {
  const { id, completed } = await request.json();
  const userId = request.headers.get("user-id");

  if (!userId)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  todos = todos.map((todo) =>
    todo.id === id && todo.userId === parseInt(userId)
      ? { ...todo, completed }
      : todo,
  );
  return NextResponse.json({ message: "Task updated successfully" });
}

export async function DELETE(request: Request) {
  const { id } = await request.json();
  const userId = request.headers.get("user-id");

  if (!userId)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  todos = todos.filter(
    (todo) => !(todo.id === id && todo.userId === parseInt(userId)),
  );
  return NextResponse.json({ message: "Task deleted successfully" });
}
