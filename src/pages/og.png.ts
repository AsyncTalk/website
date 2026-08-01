import type { APIRoute } from "astro";
import OG from "../components/OpenGraph/OG";
import { PNG } from "../components/OpenGraph/createImage";

export const GET: APIRoute = async function get() {
  const png = await PNG(
    OG({ title: "AsyncTalk｜中文 Web 开发与 AI 播客" }),
  );

  return new Response(png as unknown as ReadableStream, {
    headers: {
      "Content-Type": "image/png",
      "Cache-Control": "public, max-age=86400, s-maxage=604800",
    },
  });
};
