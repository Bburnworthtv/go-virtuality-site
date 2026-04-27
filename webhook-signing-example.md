# Webhook Signing Example

The webhook endpoint at `/api/messaging/webhook` now expects:

- `x-webhook-timestamp`
- `x-webhook-signature`

Signature format:

- HMAC-SHA256
- secret: `MESSAGING_WEBHOOK_SECRET`
- message: `${timestamp}.${rawBody}`
- header value may be either:
  - raw hex digest
  - `sha256=<hex digest>`

## Node.js example

```ts
import crypto from "crypto";

const secret = process.env.MESSAGING_WEBHOOK_SECRET!;

function signWebhook(rawBody: string, timestamp = Date.now().toString()) {
  const signature = crypto
    .createHmac("sha256", secret)
    .update(`${timestamp}.${rawBody}`)
    .digest("hex");

  return {
    timestamp,
    signature
  };
}
```

## Forwarding proxy example
If your messaging provider cannot sign requests itself, you can place a small trusted proxy in front of the app.

This repo now includes one:

```bash
npm run webhook:forwarder
```

It uses:

- `MESSAGING_WEBHOOK_SECRET`
- `WEBHOOK_FORWARDER_PORT` default `8787`
- `WEBHOOK_FORWARD_TARGET` default `http://localhost:3000/api/messaging/webhook`

You can point your provider at `http://your-host:8787`.

If you prefer your own implementation, here is the same pattern in Express:

```ts
import crypto from "crypto";
import express from "express";

const app = express();
app.use(express.text({ type: "*/*" }));

app.post("/provider-webhook", async (req, res) => {
  const rawBody = req.body ?? "";
  const timestamp = Date.now().toString();
  const signature = crypto
    .createHmac("sha256", process.env.MESSAGING_WEBHOOK_SECRET!)
    .update(`${timestamp}.${rawBody}`)
    .digest("hex");

  const response = await fetch("https://your-domain.com/api/messaging/webhook", {
    method: "POST",
    headers: {
      "content-type": req.header("content-type") || "application/json",
      "x-webhook-timestamp": timestamp,
      "x-webhook-signature": `sha256=${signature}`
    },
    body: rawBody
  });

  res.status(response.status).send(await response.text());
});
```

## cURL example

```bash
BODY='{"messageId":"abc123","status":"Delivered"}'
TIMESTAMP=$(node -e "console.log(Date.now().toString())")
SIGNATURE=$(node -e "const crypto=require('crypto'); const body=process.argv[1]; const ts=process.argv[2]; const secret=process.env.MESSAGING_WEBHOOK_SECRET; process.stdout.write(crypto.createHmac('sha256', secret).update(`${ts}.${body}`).digest('hex'))" "$BODY" "$TIMESTAMP")

curl -X POST "https://your-domain.com/api/messaging/webhook" \
  -H "content-type: application/json" \
  -H "x-webhook-timestamp: $TIMESTAMP" \
  -H "x-webhook-signature: sha256=$SIGNATURE" \
  --data "$BODY"
```

## Freshness window

Requests older than 5 minutes are rejected.

## Notes

- Sign the exact raw body bytes you send.
- Do not reformat JSON after signing.
- If you use a proxy, preserve the raw provider payload when forwarding.
- No signup or user-account system is required for this website. The security model here is server-side route protection, signed webhooks, and rate-limited public kiosk actions.
