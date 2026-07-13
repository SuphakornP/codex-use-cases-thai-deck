const INDEX_PATH = "/index.html";

function isPageRequest(request, url) {
  if (request.headers.get("accept")?.includes("text/html")) return true;
  return !url.pathname.split("/").at(-1)?.includes(".");
}

export default {
  async fetch(request, env) {
    if (request.method !== "GET" && request.method !== "HEAD") {
      return new Response("Method Not Allowed", {
        status: 405,
        headers: { allow: "GET, HEAD" },
      });
    }

    const response = await env.ASSETS.fetch(request);
    if (response.status !== 404) return response;

    const url = new URL(request.url);
    if (!isPageRequest(request, url)) return response;

    return env.ASSETS.fetch(new Request(new URL(INDEX_PATH, url), request));
  },
};
