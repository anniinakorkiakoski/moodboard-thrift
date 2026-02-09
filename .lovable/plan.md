

# Integrate eBay Browse API into Visual Search

## Overview
Add eBay as a new source adapter alongside Tradera, Depop, and the local catalog. This involves creating an eBay OAuth token manager with caching, building an eBay Browse API adapter, adding a new edge function for standalone eBay queries, and updating the database enum to include "ebay" as a platform type.

## Steps

### 1. Store eBay Secrets
Add the following secrets to Supabase:
- `EBAY_CLIENT_ID` = `Christia-CURA-PRD-db45c9f27-cc1b4cf9`
- `EBAY_CLIENT_SECRET` = `SBX-b42aa1f5b7a3-5530-4de6-8513-cc78`
- `EBAY_MARKETPLACE_ID` = `EBAY_FI`

### 2. Database Migration: Add "ebay" to platform_type enum
Run an `ALTER TYPE` to add `'ebay'` to the `platform_type` enum so search results can be stored with `platform: 'ebay'`.

```sql
ALTER TYPE platform_type ADD VALUE IF NOT EXISTS 'ebay';
```

### 3. Create `ebay-browse-listings` Edge Function
A new public edge function (`verify_jwt = false`) at `supabase/functions/ebay-browse-listings/index.ts` that:

- **OAuth Token Caching**: Uses eBay's Client Credentials Grant (`/identity/v1/oauth2/token`) to get an Application Access Token. Caches the token in-memory with its expiry time so subsequent calls within the TTL reuse it without re-authenticating.
- **Browse API Search**: Calls `GET /buy/browse/v1/item_summary/search` with:
  - `q` (search keywords)
  - `filter` for price range, condition
  - `X-EBAY-C-MARKETPLACE-ID` header set to the configured marketplace (default `EBAY_FI`, overridable via request body)
  - `limit` parameter (default 50)
- **Response**: Returns normalized listings matching the existing `NormalizedListing` schema.
- **CORS**: Full CORS support for frontend calls.

### 4. Add EbayAdapter to `visual-search` Edge Function
Add a new `EbayAdapter` class (implementing `SourceAdapter`) inside `supabase/functions/visual-search/index.ts`:

- Reuses the same OAuth token caching pattern (in-memory with expiry tracking).
- Calls the eBay Browse API search endpoint directly (not via the separate edge function, to avoid an extra network hop).
- Maps eBay item summaries to `NormalizedListing` format:
  - `source: "ebay"`
  - `price` from `price.value`, `currency` from `price.currency`
  - `images` from `image.imageUrl` and `additionalImages`
  - `listing_url` from `itemWebUrl`
  - `condition` from `condition`
  - `is_auction` based on `buyingOptions` containing `"AUCTION"`
- Register the adapter in the adapters array (line ~709) so it runs in parallel with Tradera, Depop, and local catalog.
- Update `mapSourceToPlatform` to map `"ebay"` to `"ebay"` (instead of current `"other_vintage"` fallback).

### 5. Update `supabase/config.toml`
Add the new function config:
```toml
[functions.ebay-browse-listings]
verify_jwt = false
```

### 6. Token Caching Strategy
Both the standalone edge function and the adapter within `visual-search` will use the same pattern:

```text
Module-level variables:
  cachedToken: string | null
  tokenExpiry: number (timestamp)

getEbayAccessToken():
  if cachedToken exists AND tokenExpiry > now + 60s buffer:
    return cachedToken
  else:
    POST to eBay OAuth endpoint with client credentials
    parse access_token + expires_in from response
    store in cachedToken / tokenExpiry
    return token
```

This prevents redundant OAuth calls within each edge function instance's lifetime (typically minutes to hours in Deno Deploy).

## Technical Details

### eBay Browse API Request
```
GET https://api.ebay.com/buy/browse/v1/item_summary/search
Headers:
  Authorization: Bearer {access_token}
  X-EBAY-C-MARKETPLACE-ID: EBAY_FI
  Content-Type: application/json
Query params:
  q={search terms}
  limit=50
  filter=price:[{min}..{max}],priceCurrency:EUR
```

### Files Changed
| File | Change |
|------|--------|
| `supabase/functions/ebay-browse-listings/index.ts` | New standalone edge function |
| `supabase/functions/visual-search/index.ts` | Add `EbayAdapter` class + register it |
| `supabase/config.toml` | Add `ebay-browse-listings` config |
| Database migration | Add `'ebay'` to `platform_type` enum |

