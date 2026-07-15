import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const cors = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};
const esc = (s: unknown) =>
  String(s ?? "").replace(/[<>&]/g, (c) => ({ "<": "&lt;", ">": "&gt;", "&": "&amp;" }[c]!));
const json = (b: unknown, status: number) =>
  new Response(JSON.stringify(b), { status, headers: { ...cors, "Content-Type": "application/json" } });

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: cors });
  try {
    const { id } = await req.json();
    if (!id) return json({ error: "missing id" }, 400);

    const admin = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
    );
    // Notifica solo se l'id corrisponde a un lead reale (anti-spam sulla function pubblica)
    const { data: lead, error } = await admin.from("leads").select("*").eq("id", id).single();
    if (error || !lead) return json({ error: "lead not found" }, 404);

    // --- Email via Resend (primario) ---
    const resendKey = Deno.env.get("RESEND_API_KEY");
    if (resendKey) {
      const to = Deno.env.get("EDILMEC_TO_EMAIL") ?? "info@edilmectrani.it";
      const from = Deno.env.get("RESEND_FROM") ?? "EDILMEC <onboarding@resend.dev>";
      await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: { Authorization: `Bearer ${resendKey}`, "Content-Type": "application/json" },
        body: JSON.stringify({
          from, to, reply_to: lead.email ?? undefined,
          subject: `Nuovo preventivo dal sito — ${esc(lead.name)}`,
          html: `<h2>Nuova richiesta di preventivo</h2>
            <p><strong>Nome:</strong> ${esc(lead.name)}</p>
            <p><strong>Email:</strong> ${esc(lead.email ?? "-")}</p>
            <p><strong>Telefono:</strong> ${esc(lead.phone ?? "-")}</p>
            <p><strong>Messaggio:</strong><br>${esc(lead.message ?? "-").replace(/\n/g, "<br>")}</p>
            <hr><small>Ricevuto il ${new Date(lead.created_at).toLocaleString("it-IT")}</small>`,
        }),
      });
    }

    // --- Telegram (secondario, opzionale) ---
    const tgToken = Deno.env.get("TELEGRAM_BOT_TOKEN");
    const tgChat = Deno.env.get("TELEGRAM_CHAT_ID");
    if (tgToken && tgChat) {
      const text = `📩 Nuovo preventivo EDILMEC\n\nNome: ${lead.name}\nEmail: ${lead.email ?? "-"}\nTelefono: ${lead.phone ?? "-"}\n\nMessaggio:\n${lead.message ?? "-"}`;
      await fetch(`https://api.telegram.org/bot${tgToken}/sendMessage`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ chat_id: tgChat, text }),
      });
    }

    await admin.from("leads").update({ notified_at: new Date().toISOString() }).eq("id", id);
    return json({ ok: true }, 200);
  } catch (e) {
    return json({ error: String(e) }, 500);
  }
});
