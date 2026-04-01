import { NextRequest } from "next/server";
import ListingController from "@controller/Listing";

export async function GET(req: NextRequest, context: { params: Promise<{ id: string }> }): Promise<Response> {
  const { id } = await context.params;
  return ListingController.show_action(req, id);
}

export async function PATCH(req: NextRequest, context: { params: Promise<{ id: string }> }): Promise<Response> {
  return ListingController.update_action(req, id);
}

export async function PUT(req: NextRequest, context: { params: Promise<{ id: string }> }): Promise<Response> {
  return ListingController.update_action(req, id);
}

export async function DELETE(req: NextRequest, context: { params: Promise<{ id: string }> }): Promise<Response> {
  return ListingController.destroy_action(req, id);
}
