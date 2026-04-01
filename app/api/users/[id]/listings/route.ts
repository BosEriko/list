import { NextRequest } from "next/server";
import UserController from "@controller/User";

export async function GET(req: NextRequest, context: { params: Promise<{ id: string }> }): Promise<Response> {
  const { id } = await context.params;
  return UserController.all_listings(req, id);
}
