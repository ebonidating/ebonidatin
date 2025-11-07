export async function onRequestGet(context) {
  return Response.json({ message: "Hello from Cloudflare Edge!" })
}
