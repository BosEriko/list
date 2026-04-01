export default async function show_action(req: Request, id: string) {
  return new Response(JSON.stringify({ message: "show User" }));
}
