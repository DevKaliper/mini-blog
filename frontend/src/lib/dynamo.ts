//primero sin variables de entorno
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";

const client = new DynamoDBClient({
  region: "us-east-1", 
});

export const ddb = DynamoDBDocumentClient.from(client);