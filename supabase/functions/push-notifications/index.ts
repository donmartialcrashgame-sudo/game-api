import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import webpush from "npm:web-push@3.6.7";
import { createClient } from "npm:@supabase/supabase-js@2";

const PUBLIC_KEY = Deno.env.get("GAME_API_VAPID_PUBLIC_KEY") ?? "";
const PRIVATE_KEY = Deno.env.get("GAME_API_VAPID_PRIVATE_KEY") ?? "";
const SUBJECT = Deno.env.get("GAME_API_VAPID_SUBJECT") ?? "mailto:security@game-api.online";

const admin = createClient(
  Deno.env.get("SUPABASE_URL")!,
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
);

const corsHeaders = {
  "Access-Control-Allow-Origin": "https://game-api.online",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Cache-Control": "no-store"
};

const response = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" }
  });

async function getUser(req: Request) {
  const header = req.headers.get("Authorization");
  if (!header?.startsWith("Bearer ")) return null;
  const client = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_ANON_KEY")!
  );
  const { data } = await client.auth.getUser(header.slice(7));
  return data.user ?? null;
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  if (req.method !== "POST") return response({ error: "POST required." }, 405);

  const user = await getUser(req);
  if (!user) return response({ error: "You must be signed in." }, 401);

  let body: Record<string, unknown> = {};
  try { body = await req.json(); } catch {}

  if (body.action === "public-key") {
    if (!PUBLIC_KEY) return response({ error: "Push service is not configured yet." }, 503);
    return response({ publicKey: PUBLIC_KEY });
  }

  if (body.action !== "send") return response({ error: "Unknown action." }, 400);
  if (!PUBLIC_KEY || !PRIVATE_KEY) return response({ error: "Push service keys are not configured." }, 503);

  webpush.setVapidDetails(SUBJECT, PUBLIC_KEY, PRIVATE_KEY);

  const { data: subscriptions, error } = await admin
    .from("push_subscriptions")
    .select("id,endpoint,p256dh,auth")
    .eq("user_id", user.id)
    .eq("enabled", true);

  if (error) return response({ error: error.message }, 500);
  if (!subscriptions?.length) return response({ sent: 0, message: "No active push subscription was found." });

  const payload = JSON.stringify({
    title: String(body.title || "Game API"),
    body: String(body.message || "You have a new Game API notification."),
    icon: "/favicon.svg",
    badge: "/favicon.svg",
    tag: String(body.tag || "game-api"),
    url: String(body.url || "https://game-api.online/")
  });

  let sent = 0;
  for (const sub of subscriptions) {
    try {
      await webpush.sendNotification(
        { endpoint: sub.endpoint, keys: { p256dh: sub.p256dh, auth: sub.auth } },
        payload
      );
      sent++;
    } catch (err) {
      const status = Number((err as any)?.statusCode || 0);
      if (status === 404 || status === 410) {
        await admin.from("push_subscriptions").delete().eq("id", sub.id);
      }
    }
  }

  return response({ sent, total: subscriptions.length });
});