# Security Best Practices Report

Executive summary:
The new marketing pages are mostly low-risk because their forms are not wired to a backend yet. The meaningful exposure is in the legacy Next.js `pages/api` surface, where browser-delivered secrets are being used as the sole authorization mechanism for sensitive API routes. That design currently allows anyone who can load the site bundle to recover the shared secrets and call protected endpoints directly. The next highest risks are brute-forceable kiosk codes, unsigned webhook payloads, and verbose internal error details returned to clients.

## Critical

### F-001: Public client-side secrets collapse authorization for sensitive API routes
- Rule ID: NEXT-SECRETS-001, NEXT-AUTH-001
- Severity: Critical
- Impact: Any user who can load the app can extract the dashboard or kiosk API secret from shipped browser code and directly invoke protected endpoints, including reading patient/guardian records, creating patients, discharging patients, resolving discharge codes, and registering rides.
- Locations:
  - `src/lib/apiClient.ts:1-7`
  - `src/pages/kiosk.tsx:16,60-65,109-114`
  - `src/lib/requireAuth.ts:4-18`
  - `src/pages/api/kiosk/session/resolve.ts:6-20,31-33`
  - `src/pages/api/kiosk/register-ride.ts:18-33,43-45`
  - `.env.local.example:8-11`
- Evidence:
  - `src/lib/apiClient.ts` sets `x-api-key` from `NEXT_PUBLIC_DASHBOARD_API_SECRET`, which is browser-exposed by design.
  - `src/pages/kiosk.tsx` sends `x-kiosk-key` from `NEXT_PUBLIC_KIOSK_API_SECRET` in client fetches.
  - Server routes trust these headers as the sole auth control.
  - `.env.local.example` explicitly instructs operators to make the public secrets “same_value_as_above” as the server secrets.
- Fix:
  - Remove `NEXT_PUBLIC_DASHBOARD_API_SECRET` and `NEXT_PUBLIC_KIOSK_API_SECRET` entirely.
  - Replace shared-secret browser auth with real user/session auth for dashboard routes.
  - For kiosk flows, avoid browser-held bearer secrets. Prefer one-time opaque server-generated session tokens with server-side validation and route-specific anti-abuse controls.
- Mitigation:
  - Rotate `DASHBOARD_API_SECRET` and `KIOSK_API_SECRET` immediately if this code has been deployed.
  - Assume prior exposure once the browser bundle was accessible.
- False positive notes:
  - None. `NEXT_PUBLIC_*` values are intentionally shipped to the browser and are not secrets.

### F-002: Short kiosk discharge codes are brute-forceable, especially because the kiosk secret is public
- Rule ID: NEXT-DOS-001
- Severity: High
- Impact: Attackers can automate guessing active kiosk discharge codes and resolve patient details or submit ride requests, especially because the kiosk auth secret is already exposed client-side.
- Locations:
  - `src/lib/kioskSession.ts:6-7,17-25`
  - `src/pages/api/kiosk/session/resolve.ts:35-53`
  - `src/pages/api/kiosk/register-ride.ts:91-129`
- Evidence:
  - Session TTL is 2 hours.
  - Session tokens are length 6 from a 32-character alphabet, yielding about 30 bits of entropy.
  - No rate limiting, lockout, or IP throttling is present on the resolve or register endpoints.
- Fix:
  - Increase token length materially, for example 10-12 characters minimum.
  - Add server-side rate limiting and attempt throttling per IP/session token.
  - Consider storing hashed session tokens rather than raw tokens in audit metadata.
- Mitigation:
  - Shorten kiosk session TTL until stronger controls are in place.
  - Monitor repeated failed lookups in audit logs.
- False positive notes:
  - If these endpoints were fully isolated behind a trusted internal network and unavailable to the public internet, risk would be reduced, but that protection is not visible in app code.

## High

### F-003: Webhook authenticity relies on a shared header secret instead of a signed raw body
- Rule ID: NEXT-WEBHOOK-001
- Severity: High
- Impact: Anyone who learns the shared secret can forge delivery updates or guardian replies. Because the request body is not cryptographically bound, there is no payload integrity protection and replayed or modified bodies are not detectable.
- Location:
  - `src/pages/api/messaging/webhook.ts:102-122,136-215`
- Evidence:
  - The webhook accepts either `x-webhook-secret` or `Authorization: Bearer ...` and compares it to `MESSAGING_WEBHOOK_SECRET`.
  - The handler then trusts `req.body` directly and updates notification state or inserts guardian reply audit logs.
  - No raw-body signature verification is implemented.
- Fix:
  - Switch to provider-supported HMAC signature verification over the raw request body.
  - Reject unsigned or improperly signed requests before parsing business fields.
  - Add replay protection if the provider offers timestamps/nonces.
- Mitigation:
  - Restrict by provider IP ranges at the edge if possible.
  - Rotate the webhook secret if there is any suspicion it has been exposed.
- False positive notes:
  - If the messaging provider does not support request signing, document that limitation and compensate with strict source allowlisting and rate limits.

## Medium

### F-004: Internal database and operational error details are returned to clients
- Rule ID: NEXT-ERROR-001
- Severity: Medium
- Impact: Attackers can learn backend behavior, table expectations, and operational failures from client-visible error messages, which increases the precision of further attacks and reconnaissance.
- Locations:
  - `src/pages/api/dashboard.ts:114-119`
  - `src/pages/api/patients/create.ts:102-107,133-138,171-176,190-195,207-212`
  - `src/pages/api/patients/discharge.ts:98-103`
  - `src/pages/api/patients/index.ts:44-49`
  - `src/pages/api/wards/index.ts:29-34,78-83`
- Evidence:
  - Multiple routes return `details: <supabase error message>` or similarly detailed server messages to callers.
- Fix:
  - Return generic client-facing errors only.
  - Keep detailed diagnostic messages in server logs with sensitive field redaction.
- Mitigation:
  - Audit existing logs for sensitive data leakage while changing error handling.
- False positive notes:
  - Some error content may seem harmless in development, but these routes are request-facing and should not expose internals in production.

### F-005: Sensitive and abuse-prone endpoints have no visible rate limiting or abuse controls
- Rule ID: NEXT-DOS-001
- Severity: Medium
- Impact: Attackers can spam patient creation, discharge notifications, kiosk resolution, ride registration, and webhook ingestion, potentially causing service abuse, SMS cost amplification, and operational noise.
- Locations:
  - `src/pages/api/patients/create.ts:9-225`
  - `src/pages/api/patients/discharge.ts:57-292`
  - `src/pages/api/patients/pre-notify.ts:55-188`
  - `src/pages/api/kiosk/session/resolve.ts:23-58`
  - `src/pages/api/kiosk/register-ride.ts:35-221`
  - `src/pages/api/messaging/webhook.ts:124-220`
- Evidence:
  - No route contains IP throttling, per-key quotas, replay protection, or request cost controls.
  - Messaging routes can trigger external sends or state changes.
- Fix:
  - Add rate limiting at the edge and application level for these endpoints.
  - Apply stricter limits to kiosk lookup/submit and notification-sending routes.
- Mitigation:
  - Add observability around request spikes and external message volume.
- False positive notes:
  - Infrastructure-level protections may exist, but none are visible in the repository.

## Low

### F-006: No visible security headers or CSP configuration for the marketing site
- Rule ID: NEXT-HEADERS-001, REACT-CSP-001
- Severity: Low
- Impact: Missing browser-enforced defenses increases the blast radius of future frontend bugs such as XSS or clickjacking issues.
- Location:
  - `next.config.js:1-6`
- Evidence:
  - `next.config.js` contains only `reactStrictMode: true`.
  - No app-level CSP, `X-Content-Type-Options`, or frame protections are visible in code.
- Fix:
  - Add a baseline security header policy, ideally at the edge or through Next config/headers.
  - Include CSP, `X-Content-Type-Options: nosniff`, clickjacking protection, and a sane `Referrer-Policy`.
- Mitigation:
  - Verify whether Vercel or another edge layer is already adding these headers.
- False positive notes:
  - This may already be enforced outside the repo; runtime verification is needed.

## Notes on the new marketing forms

- `src/app/contact/page.tsx` and `src/app/book/page.tsx` are currently static forms with no backend submission path.
- That means there is no immediate server-side injection, CSRF, or data-handling issue there yet.
- Once these forms are wired up, they should be implemented with runtime validation, spam protection, rate limits, and generic error handling from the start.

## Recommended remediation order

1. Remove all browser-exposed shared secrets and redesign dashboard/kiosk auth.
2. Harden kiosk sessions with longer tokens and rate limiting.
3. Replace webhook shared-secret auth with signed raw-body verification.
4. Stop returning internal error details to clients.
5. Add edge/app-level rate limits and baseline security headers.
