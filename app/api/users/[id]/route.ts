import { NextRequest } from "next/server";
import UserController from "@controller/User";

export async function GET(req: NextRequest, context: { params: Promise<{ id: string }> }): Promise<Response> {
  const { id } = await context.params;
  return UserController.show_action(req, id);
}

export async function PATCH(req: NextRequest, context: { params: Promise<{ id: string }> }): Promise<Response> {
  const { id } = await context.params;
  return UserController.update_action(req, id);
}

export async function PUT(req: NextRequest, context: { params: Promise<{ id: string }> }): Promise<Response> {
  const { id } = await context.params;
  return UserController.update_action(req, id);
}

export async function DELETE(req: NextRequest, context: { params: Promise<{ id: string }> }): Promise<Response> {
  const { id } = await context.params;
  return UserController.destroy_action(req, id);
}
