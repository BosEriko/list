import ListingController from "@controller/Listing";

export async function GET(req: Request, { params }: { params: { id: string } }) {
  return ListingController.show_action(req, params.id);
}

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  return ListingController.update_action(req, params.id);
}

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  return ListingController.update_action(req, params.id);
}

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  return ListingController.destroy_action(req, params.id);
}
