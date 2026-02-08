import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const ENDPOINT_URL = "https://gerwikyaggikykftcyxm.supabase.co/functions/v1/ebay-account-deletion";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

async function computeChallengeResponse(
  challengeCode: string,
  verificationToken: string,
  endpoint: string
): Promise<string> {
  const input = challengeCode + verificationToken + endpoint;
  const encoder = new TextEncoder();
  const data = encoder.encode(input);
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
}

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  const verificationToken = Deno.env.get("EBAY_VERIFICATION_TOKEN") || "";

  if (!verificationToken) {
    console.error("[ebay-account-deletion] EBAY_VERIFICATION_TOKEN not configured");
    return new Response(
      JSON.stringify({ error: "Server misconfiguration" }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }

  // GET: eBay challenge verification
  if (req.method === "GET") {
    const url = new URL(req.url);
    const challengeCode = url.searchParams.get("challenge_code");

    if (!challengeCode) {
      console.warn("[ebay-account-deletion] GET request missing challenge_code");
      return new Response(
        JSON.stringify({ error: "Missing challenge_code query parameter" }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    const challengeResponse = await computeChallengeResponse(
      challengeCode,
      verificationToken,
      ENDPOINT_URL
    );

    console.log(
      `[ebay-account-deletion] Challenge verified. Code: ${challengeCode.substring(0, 8)}...`
    );

    return new Response(
      JSON.stringify({ challengeResponse }),
      {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }

  // POST: Account deletion/closure notification
  if (req.method === "POST") {
    try {
      const body = await req.json();
      console.log(
        `[ebay-account-deletion] Notification received: ${JSON.stringify({
          notificationType: body?.metadata?.topic || "unknown",
          userId: body?.notification?.data?.userId || "unknown",
          timestamp: new Date().toISOString(),
        })}`
      );

      return new Response(
        JSON.stringify({ status: "ok" }),
        {
          status: 200,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    } catch (e) {
      console.error("[ebay-account-deletion] Failed to parse POST body:", e);
      return new Response(null, {
        status: 204,
        headers: corsHeaders,
      });
    }
  }

  // Unsupported method
  return new Response(
    JSON.stringify({ error: "Method not allowed" }),
    {
      status: 405,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    }
  );
});
