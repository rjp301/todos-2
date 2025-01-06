import type { APIRoute } from "astro";
const { COOLIFY_FQDN, COOLIFY_URL, COOLIFY_BRANCH, COOLIFY_CONTAINER_NAME } =
  import.meta.env;

export const GET: APIRoute = async () => {
  return new Response(
    JSON.stringify({
      COOLIFY_FQDN,
      COOLIFY_URL,
      COOLIFY_BRANCH,
      COOLIFY_CONTAINER_NAME,
    }),
  );
};
