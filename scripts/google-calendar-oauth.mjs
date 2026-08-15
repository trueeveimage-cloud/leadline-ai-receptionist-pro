#!/usr/bin/env node

import http from "node:http";
import { URL } from "node:url";

const clientId = process.env.GOOGLE_CALENDAR_CLIENT_ID;
const clientSecret = process.env.GOOGLE_CALENDAR_CLIENT_SECRET;
const port = Number(process.env.GOOGLE_OAUTH_PORT || 4567);
const redirectUri = `http://127.0.0.1:${port}/oauth2callback`;
const scopes = ["https://www.googleapis.com/auth/calendar.events"];

if (!clientId || !clientSecret) {
  console.error("Missing GOOGLE_CALENDAR_CLIENT_ID or GOOGLE_CALENDAR_CLIENT_SECRET.");
  console.error("Add them to your shell environment, then run this script again.");
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

const server = http.createServer(async (req, res) => {
  const requestUrl = new URL(req.url || "/", redirectUri);
  if (requestUrl.pathname !== "/oauth2callback") {
    res.writeHead(404).end("Not found");
    return;
  }

  const code = requestUrl.searchParams.get("code");
  if (!code) {
    res.writeHead(400).end("Missing OAuth code.");
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
    if (!tokenResponse.ok || !tokenData.refresh_token) {
      throw new Error(JSON.stringify(tokenData));
    }

    res.writeHead(200, { "Content-Type": "text/plain; charset=utf-8" });
    res.end("Google Calendar approved. You can close this tab and return to Codex.");
    console.log("\nAdd this server-only secret in production:");
    console.log(`GOOGLE_CALENDAR_REFRESH_TOKEN=${tokenData.refresh_token}`);
    console.log("\nKeep it out of VITE_* variables and out of client-side code.");
  } catch (error) {
    res.writeHead(500, { "Content-Type": "text/plain; charset=utf-8" });
    res.end("OAuth token exchange failed. Check the Codex terminal output.");
    console.error(error);
  } finally {
    server.close();
  }
});

server.listen(port, "127.0.0.1", () => {
  console.log("Open this URL in the Google account that owns the demo calendar:");
  console.log(authUrl.toString());
  console.log(`\nWaiting for OAuth callback on ${redirectUri}`);
});
