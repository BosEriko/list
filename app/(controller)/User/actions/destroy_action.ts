export default async function destroy_action(req: Request, id: string) {
  return new Response(JSON.stringify({ message: "destroy User" }));
}
