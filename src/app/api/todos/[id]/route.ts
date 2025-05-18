import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/utils/mongodb/mongodb";
import { Todo } from "@/models/Todo";

export const dynamic = "force-dynamic";

interface TodoErrorType {
  message: string;
  code?: string;
}

interface UpdateTodoRequest {
  title?: string;
  description?: string;
  completed?: boolean;
}

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();
    const id = params.id;

    // Find the todo by ID
    const todo = await Todo.findById(id);

    if (!todo) {
      return NextResponse.json({ error: "Todo not found" }, { status: 404 });
    }

    return NextResponse.json(todo);
  } catch (error: unknown) {
    console.error("Error fetching todo:", error);

    const todoError = error as TodoErrorType;
    const errorMessage = todoError.message || "Failed to fetch todo";

    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();
    const id = params.id;
    const updateData = (await request.json()) as UpdateTodoRequest;

    // Update the todo by ID
    const updatedTodo = await Todo.findByIdAndUpdate(id, updateData, {
      new: true,
    });

    if (!updatedTodo) {
      return NextResponse.json({ error: "Todo not found" }, { status: 404 });
    }

    return NextResponse.json(updatedTodo);
  } catch (error: unknown) {
    console.error("Error updating todo:", error);

    const todoError = error as TodoErrorType;
    const errorMessage = todoError.message || "Failed to update todo";

    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();
    const id = params.id;
    const updateData = (await request.json()) as UpdateTodoRequest;

    // Find the todo first to ensure it exists
    const existingTodo = await Todo.findById(id);

    if (!existingTodo) {
      return NextResponse.json({ error: "Todo not found" }, { status: 404 });
    }

    // Update only the fields provided in the request
    const updatedTodo = await Todo.findByIdAndUpdate(
      id,
      { $set: updateData },
      { new: true }
    );

    return NextResponse.json(updatedTodo);
  } catch (error: unknown) {
    console.error("Error patching todo:", error);

    const todoError = error as TodoErrorType;
    const errorMessage = todoError.message || "Failed to update todo";

    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();
    const id = params.id;

    // Delete the todo by ID
    const deletedTodo = await Todo.findByIdAndDelete(id);

    if (!deletedTodo) {
      return NextResponse.json({ error: "Todo not found" }, { status: 404 });
    }

    return NextResponse.json({
      message: "Todo deleted successfully",
    });
  } catch (error: unknown) {
    console.error("Error deleting todo:", error);

    const todoError = error as TodoErrorType;
    const errorMessage = todoError.message || "Failed to delete todo";

    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
