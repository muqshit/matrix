// This runs on Netlify's servers, not in the visitor's browser — so your
// FreeModel API key (stored as an environment variable) never gets exposed.

export default async (request, context) => {
  const apiKey = process.env.FREEMODEL_API_KEY;

  if (!apiKey) {
    return new Response(
      JSON.stringify({ error: "Missing FREEMODEL_API_KEY. Add it in Netlify: Site settings > Environment variables." }),
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

  // Stream FreeModel's response straight through to the browser.
  return new Response(upstream.body, {
    status: upstream.status,
    headers: { "Content-Type": "text/event-stream" }
  });
};

export const config = {
  path: "/api/chat"
};

