

# Fix: Search Results Not Displaying Despite Successful API Calls

## Problem
eBay and Tradera APIs return listings successfully, and results are stored in the database, but users see "No matches found" because of a three-part bug chain in scoring, status logic, and frontend data fetching.

## Root Cause Chain

```text
Adapters return listings
        |
        v
Scoring is too strict (max ~0.46 for text searches)
        |
        v
Status set to "no_matches" (needs score >= 0.5)
        |
        v
Frontend skips fetching results (only reads when "completed")
        |
        v
User sees empty results
```

## Fixes

### Fix 1: Backend -- Lower the status threshold and use "tentative_matches"
**File:** `supabase/functions/visual-search/index.ts` (line ~994)

Change the status logic so that:
- If ANY results were stored, status is at least `"tentative_matches"`
- Only set `"no_matches"` when zero listings came back from adapters (already handled at line 876)

Current:
```typescript
const finalStatus = highQuality.length > 0 || mediumQuality.length > 0 ? "completed" : "no_matches";
```

New:
```typescript
const finalStatus = highQuality.length > 0 ? "completed" : "tentative_matches";
```

### Fix 2: Backend -- Boost base scores for text searches
**File:** `supabase/functions/visual-search/index.ts` (scoring function ~line 1299)

The `visualSimilarity` base of 0.4 is too low as a starting point. For text-based searches (where attributes are sparse), add a text-query boost so that keyword-matching listings aren't penalized by empty visual/attribute fields.

Adjust the scoring to give a higher baseline when the search is text-based (detected by empty `visualSignature.dominantColors`):
- Base `visualSimilarity` = 0.5 for text searches (no image to compare against, so neutral score instead of penalty)
- Add a keyword density bonus to `textSimilarity` calculation

### Fix 3: Frontend -- Fetch results for both "completed" and "tentative_matches"
**File:** `src/hooks/useVisualSearch.ts` (line ~112)

Change the status guard to also fetch results for `tentative_matches`:
```typescript
if (search.status === 'completed' || search.status === 'tentative_matches') {
```

## Files Changed

| File | Change |
|------|--------|
| `supabase/functions/visual-search/index.ts` | Fix status threshold logic (line ~994); boost text search scoring baseline (line ~1299) |
| `src/hooks/useVisualSearch.ts` | Fetch results for both "completed" and "tentative_matches" statuses (line ~112) |

## Technical Details

### Scoring Math (before fix)
For a text search like "black jeans" with empty attributes:
- `visualSimilarity` = 0.4 (base) x 0.4 (weight) = 0.16
- `textSimilarity` = ~0.3 x 0.25 = 0.075
- `attributeMatch` = ~0 x 0.25 = 0
- `qualityScore` = 0.5 x 0.1 = 0.05
- **Total: ~0.285** (well below 0.5 threshold)

### Scoring Math (after fix)
- `visualSimilarity` = 0.5 (boosted base) x 0.4 = 0.20
- `textSimilarity` = ~0.5 (boosted) x 0.25 = 0.125
- `attributeMatch` = ~0.1 x 0.25 = 0.025
- `qualityScore` = 0.5 x 0.1 = 0.05
- **Total: ~0.40** -- and status threshold lowered so any stored results are shown as tentative matches

