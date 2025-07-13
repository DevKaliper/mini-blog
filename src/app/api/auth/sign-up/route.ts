// app/api/posts/route.ts (App Router)
import { NextRequest, NextResponse } from "next/server";


export async function POST(request: NextRequest) {
  const { username, email, password } = await request.json();
  const INTERNAL_BACKEND_URL = process.env.INTERNAL_BACKEND_URL;

    const response = await fetch(`${INTERNAL_BACKEND_URL}/api/users/register`, {
        method: "POST",
        headers: {
        "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, email, password }),
    });

    if (response.ok) {
      return NextResponse.json({ message: "User created successfully" }, { status: 201 });
    } else {
      return NextResponse.json({ error: "Error creating user" }, { status: 500 });
    }

}
