import crypto from "crypto";
import http from "http";
import { URL } from "url";

const port = Number(process.env.WEBHOOK_FORWARDER_PORT || 8787);
const target = process.env.WEBHOOK_FORWARD_TARGET || "http://localhost:3000/api/messaging/webhook";
const secret = process.env.MESSAGING_WEBHOOK_SECRET;
const maxBodyBytes = 64 * 1024;

if (!secret) {
  console.error("MESSAGING_WEBHOOK_SECRET is required.");
  process.exit(1);
}

function sendJson(res, statusCode, payload) {
  const body = JSON.stringify(payload);
  res.writeHead(statusCode, {
    "content-type": "application/json; charset=utf-8",
    "content-length": Buffer.byteLength(body, "utf8")
  });
  res.end(body);
}

function signBody(timestamp, rawBody) {
  return crypto
    .createHmac("sha256", secret)
    .update(`${timestamp}.${rawBody}`)
    .digest("hex");
}

const server = http.createServer(async (req, res) => {
  if (req.method !== "POST") {
    res.writeHead(405, { allow: "POST" });
    res.end("Method not allowed");
    return;
  }

  const chunks = [];
  let total = 0;

  for await (const chunk of req) {
    const buffer = Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk);
    total += buffer.length;

    if (total > maxBodyBytes) {
      res.writeHead(413);
      res.end("Payload too large");
      return;
    }

    chunks.push(buffer);
  }

  const rawBody = Buffer.concat(chunks).toString("utf8");
  const timestamp = Date.now().toString();
  const signature = signBody(timestamp, rawBody);

  try {
    const response = await fetch(new URL(target), {
      method: "POST",
      headers: {
        "content-type": req.headers["content-type"] || "application/json",
        "x-webhook-timestamp": timestamp,
        "x-webhook-signature": `sha256=${signature}`
      },
      body: rawBody
    });

    const responseText = await response.text();
    res.writeHead(response.status, {
      "content-type": response.headers.get("content-type") || "text/plain; charset=utf-8"
    });
    res.end(responseText);
  } catch (error) {
    console.error("Webhook forwarding failed:", error);
    sendJson(res, 502, { error: "Webhook forwarding failed" });
  }
});

server.listen(port, () => {
  console.log(`Webhook forwarder listening on http://localhost:${port}`);
  console.log(`Forwarding signed requests to ${target}`);
});
