#!/usr/bin/env node

import http from "node:http";
import { URL } from "node:url";

const clientId = process.env.GOOGLE_DATA_MANAGER_CLIENT_ID;
const clientSecret = process.env.GOOGLE_DATA_MANAGER_CLIENT_SECRET;
const port = Number(process.env.GOOGLE_DATA_MANAGER_OAUTH_PORT || 4568);
const redirectUri = `http://127.0.0.1:${port}/oauth2callback`;
const scopes = [
  "https://www.googleapis.com/auth/datamanager",
  "https://www.googleapis.com/auth/cloud-platform",
];

if (!clientId || !clientSecret) {
  console.error("Missing GOOGLE_DATA_MANAGER_CLIENT_ID or GOOGLE_DATA_MANAGER_CLIENT_SECRET.");
  process.exit(1);
}

const authUrl = new URL("https://accounts.google.com/o/oauth2/v2/auth");
authUrl.search = new URLSearchParams({
  client_id: clientId,
  redirect_uri: redirectUri,
  response_type: "code",
  scope: scopes.join(" "),
  access_type: "offline",
  prompt: "consent",
}).toString();

const server = http.createServer(async (request, response) => {
  const requestUrl = new URL(request.url || "/", redirectUri);
  if (requestUrl.pathname !== "/oauth2callback") {
    response.writeHead(404).end("Not found");
    return;
  }

  const code = requestUrl.searchParams.get("code");
  if (!code) {
    response.writeHead(400).end("Missing OAuth code.");
    return;
  }

  try {
    const tokenResponse = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        client_id: clientId,
        client_secret: clientSecret,
        code,
        redirect_uri: redirectUri,
        grant_type: "authorization_code",
      }),
    });
    const tokenData = await tokenResponse.json();
    if (!tokenResponse.ok || !tokenData.refresh_token) throw new Error("Token exchange failed.");

    response.writeHead(200, { "Content-Type": "text/plain; charset=utf-8" });
    response.end("Google Data Manager approved. Close this tab and return to Codex.");
    console.log("\nAdd this server-only production secret:");
    console.log(`GOOGLE_DATA_MANAGER_REFRESH_TOKEN=${tokenData.refresh_token}`);
    console.log("\nNever put this token in a VITE_* variable or client-side code.");
  } catch (error) {
    response.writeHead(500, { "Content-Type": "text/plain; charset=utf-8" });
    response.end("OAuth token exchange failed. Check the terminal.");
    console.error(error instanceof Error ? error.message : error);
  } finally {
    server.close();
  }
});

server.listen(port, "127.0.0.1", () => {
  console.log("Open this URL with the Google account that can manage the Ads destination:");
  console.log(authUrl.toString());
  console.log(`\nWaiting for OAuth callback on ${redirectUri}`);
});
