import { ddb } from "@/lib/dynamo";

import { UpdateCommand } from "@aws-sdk/lib-dynamodb";
import { NextRequest, NextResponse } from "next/server";


export async function POST(req: NextRequest) {
  const body = await req.json();

  const command = new UpdateCommand({
    TableName: "miniblogs",
    Key: {
      idPartition: body.idPartition,
    },
    UpdateExpression: "set likes = likes + :increment",
    ExpressionAttributeValues: {
      ":increment": 1,
    },
    ReturnValues: "ALL_NEW",
  });


  try {
    await ddb.send(command);
    return NextResponse.json({ message: "Post actualizado" });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Error al actualizar el post" }, { status: 500 });
  }
}

