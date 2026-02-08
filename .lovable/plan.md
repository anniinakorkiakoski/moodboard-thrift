

# eBay Account Deletion Notification Endpoint

## Summary

Create a Supabase Edge Function at `ebay-account-deletion` that handles eBay's Marketplace Account Deletion/Closure notification requirements. This is a prerequisite for eBay Browse API access.

**Endpoint URL:** `https://gerwikyaggikykftcyxm.supabase.co/functions/v1/ebay-account-deletion`

## What This Does

eBay requires all API consumers to provide a notification endpoint that:
1. **GET** -- Responds to a verification challenge by computing `SHA256_HEX(challenge_code + verification_token + endpoint_url)` and returning it as JSON
2. **POST** -- Accepts account deletion/closure notifications and returns 200 OK

## Implementation Steps

### Step 1: Store the Verification Token as a Secret

Add a new Supabase secret:
- **Name:** `EBAY_VERIFICATION_TOKEN`
- **Value:** `ebay_api_verify_cura_ai_feb_2026`

This keeps the token out of source code and only accessible server-side via `Deno.env.get()`.

### Step 2: Create the Edge Function

Create `supabase/functions/ebay-account-deletion/index.ts`:

- **No JWT verification** -- eBay's requests are unauthenticated webhook-style calls
- **GET handler** -- Reads `challenge_code` from query params, computes SHA-256 hex digest of `challenge_code + verification_token + endpoint_url`, returns `{"challengeResponse": "<hex>"}` with `Content-Type: application/json` and status 200
- **POST handler** -- Accepts the notification body, logs it for auditing, returns 200 OK with empty JSON
- **Error handling** -- Returns 400 if `challenge_code` is missing on GET; returns 204 No Content if POST body parsing fails
- **No BOM** -- All JSON responses use standard UTF-8 encoding without byte-order mark

The endpoint URL used in the SHA-256 computation will be the full Supabase function URL:
`https://gerwikyaggikykftcyxm.supabase.co/functions/v1/ebay-account-deletion`

### Step 3: Update Config

Add the function to `supabase/config.toml` with `verify_jwt = false` since eBay sends unauthenticated requests.

### Step 4: Deploy and Verify

Deploy the edge function and test the GET challenge endpoint to confirm it returns the correct SHA-256 response.

## Technical Details

### SHA-256 Challenge Flow

```text
Input string = challenge_code + "ebay_api_verify_cura_ai_feb_2026" + "https://gerwikyaggikykftcyxm.supabase.co/functions/v1/ebay-account-deletion"

Output = SHA256 hex digest of input string (lowercase)

Response: { "challengeResponse": "<hex_digest>" }
```

### Edge Function Pseudocode

```text
GET /ebay-account-deletion?challenge_code=abc123
  -> Read challenge_code from URL params
  -> If missing: return 400 {"error": "Missing challenge_code"}
  -> Compute: SHA256(challenge_code + token + endpoint)
  -> Return 200 {"challengeResponse": "<hex>"}

POST /ebay-account-deletion
  -> Parse JSON body (log notification type + userId)
  -> Return 200 {"status": "ok"}
  -> On parse error: return 204 No Content
```

### Files to Create/Modify

1. **New:** `supabase/functions/ebay-account-deletion/index.ts` -- The edge function
2. **Edit:** `supabase/config.toml` -- Add `[functions.ebay-account-deletion]` with `verify_jwt = false`

### Security Notes

- Verification token stored as Supabase secret, never in source code or frontend
- No CORS needed (eBay calls server-to-server, not from a browser)
- CORS headers included anyway for flexibility (preflight handling)
- No sensitive data returned in any response

