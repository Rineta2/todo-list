import { NextResponse } from "next/server";

import bcrypt from "bcryptjs";

import Account from "@/models/Account";

import { connectDB } from "@/utils/mongodb/mongodb";

interface RegistrationError extends Error {
  code?: number;
  keyPattern?: Record<string, unknown>;
}

export async function POST(req: Request) {
  try {
    const { name, email, password } = await req.json();

    // Connect to MongoDB
    await connectDB();

    // Check if user already exists
    const existingUser = await Account.findOne({ email });
    if (existingUser) {
      return NextResponse.json(
        { error: "Email already registered" },
        { status: 400 }
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    const user = await Account.create({
      name,
      email,
      password: hashedPassword,
    });

    // Remove password from response
    const userWithoutPassword = {
      id: user._id,
      name: user.name,
      email: user.email,
      createdAt: user.createdAt,
    };

    return NextResponse.json(
      { message: "User registered successfully", user: userWithoutPassword },
      { status: 201 }
    );
  } catch (error) {
    console.error("Registration error:", error);
    const err = error as RegistrationError;
    return NextResponse.json(
      { error: err.message || "Something went wrong" },
      { status: 500 }
    );
  }
}
