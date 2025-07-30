// app/api/posts/route.ts (App Router)
import { NextResponse } from "next/server";
import { ScanCommand } from "@aws-sdk/lib-dynamodb";
import { ddb } from "@/lib/dynamo";
import { sortPostsByDate } from "@/lib/utils";

export async function GET() {

  // Fetch all posts from the DynamoDB table the more recent posts first

  const command = new ScanCommand({
    TableName: "miniblogs",
    Select: "ALL_ATTRIBUTES",
  });

  try {
    const response = await ddb.send(command);
    return NextResponse.json({ response: sortPostsByDate(response.Items) }, { status: 200 });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Error al guardar" }, { status: 500 });
  }
}





