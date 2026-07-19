export default async (request, context) => {
  const apiKey = process.env.FREEMODEL_API_KEY;

  if (!apiKey) {
    return new Response(
      JSON.stringify({ error: { message: "Missing FREEMODEL_API_KEY. Add it in Netlify: Site settings > Environment variables." } }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }

  const body = await request.text();

  const upstream = await fetch("https://api.freemodel.dev/v1/images/generations", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": "Bearer " + apiKey
    },
    body
  });

  const text = await upstream.text();
  return new Response(text, {
    status: upstream.status,
    headers: { "Content-Type": "application/json" }
  });
};

export const config = {
  path: "/.netlify/functions/image"
};
