import type { APIRoute } from "astro";

export const prerender = true;

const serverCard = {
  $schema: "https://static.modelcontextprotocol.io/schemas/mcp-server-card/v1.json",
  version: "1.0",
  protocolVersion: "2025-06-18",
  serverInfo: {
    name: "asynctalk",
    title: "AsyncTalk",
    version: "2.0.0",
  },
  description: "AsyncTalk 是一档中文 Web 开发播客。",
  documentationUrl: "https://asynctalk.com",
  transport: {
    type: "streamable-http",
    endpoint: "/mcp",
  },
  capabilities: {
    tools: {},
    prompts: {},
    resources: {},
  },
};

export const GET: APIRoute = () => {
  return new Response(JSON.stringify(serverCard, null, 2), {
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Cache-Control": "public, max-age=3600",
      "Content-Type": "application/json; charset=utf-8",
      "X-Content-Type-Options": "nosniff",
    },
  });
};
