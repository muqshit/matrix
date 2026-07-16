export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);

    if (url.pathname === "/chat" && request.method === "POST") {
      return handleChat(request, env);
    }

    // Everything else (index.html, logo.png, manifest.json, etc.) is served
    // straight from the static assets bound below.
    return env.ASSETS.fetch(request);
  }
};

async function handleChat(request, env) {
  const apiKey = env.FREEMODEL_API_KEY;

  if (!apiKey) {
    return new Response(
      JSON.stringify({ error: "Missing FREEMODEL_API_KEY. Set it with: wrangler secret put FREEMODEL_API_KEY" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }

  const body = await request.text();

  const upstream = await fetch("https://api.freemodel.dev/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": "Bearer " + apiKey
    },
    body
  });

  return new Response(upstream.body, {
    status: upstream.status,
    headers: { "Content-Type": "text/event-stream" }
  });
}
