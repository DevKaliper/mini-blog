// app/api/posts/route.ts (App Router)
import { NextRequest, NextResponse } from "next/server";
import { PutCommand } from "@aws-sdk/lib-dynamodb";
import { ddb } from "@/lib/dynamo";

export async function POST(req: NextRequest) {
  const body = await req.json();


  const command = new PutCommand({
    TableName: "miniblogs",
    Item: {
       ...body,
    },
  });

  try {
    await ddb.send(command);
    return NextResponse.json({ message: "Post creado" });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Error al guardar" }, { status: 500 });
  }
}
