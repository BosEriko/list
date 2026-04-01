export default async function index_action(req: Request) {
  return new Response(JSON.stringify({ message: "index User" }));
}
