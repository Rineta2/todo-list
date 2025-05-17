import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/utils/mongodb/mongodb";
import { Todo } from "@/models/Todo";

export const dynamic = "force-dynamic";

interface TodoErrorType {
  message: string;
  code?: string;
}

interface CreateTodoRequest {
  title: string;
  description?: string;
  completed?: boolean;
}

// GET all todos
export async function GET() {
  try {
    await connectDB();

    // Fetch and sort all todos by creation date (descending)
    const todos = await Todo.find().sort({ createdAt: -1 });

    return NextResponse.json(todos);
  } catch (error: unknown) {
    console.error("Error fetching todos:", error);

    const todoError = error as TodoErrorType;
    const errorMessage = todoError.message || "Failed to fetch todos";

    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}

// POST new todo
export async function POST(request: NextRequest) {
  try {
    await connectDB();

    // Parse the request body
    const todoData = (await request.json()) as CreateTodoRequest;

    // Validate required fields
    if (!todoData.title) {
      return NextResponse.json({ error: "Title is required" }, { status: 400 });
    }

    // Create the new todo
    const todo = await Todo.create({
      ...todoData,
      createdAt: new Date(),
    });

    return NextResponse.json(todo, { status: 201 });
  } catch (error: unknown) {
    console.error("Error creating todo:", error);

    const todoError = error as TodoErrorType;
    const errorMessage = todoError.message || "Failed to create todo";

    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
