import * as React from "react";
import { render } from "@react-email/render";
import { supabaseAdmin } from "@/integrations/supabase/client.server";
import {
  getLeadmapEmailFrom,
  getLeadmapEmailSenderDomain,
  getLeadmapOwnerEmail,
} from "./email-config.server";
import { TEMPLATES } from "./email-templates/registry";

function generateToken(): string {
  const bytes = new Uint8Array(32);
  crypto.getRandomValues(bytes);
  return Array.from(bytes)
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("");
}

export async function queueOwnerNotification(
  templateName: string,
  templateData: Record<string, unknown>,
) {
  const template = TEMPLATES[templateName];
  if (!template?.to) throw new Error(`Owner notification template not found: ${templateName}`);

  const messageId = crypto.randomUUID();
  const element = React.createElement(template.component, templateData);
  const html = await render(element);
  const text = await render(element, { plainText: true });
  const subject =
    typeof template.subject === "function" ? template.subject(templateData) : template.subject;

  const emailDb = supabaseAdmin;
  const recipient =
    template.to === "__LEADMAP_OWNER_EMAIL__" ? getLeadmapOwnerEmail() : template.to;
  const normalizedRecipient = recipient.toLowerCase();
  const { data: existingToken, error: tokenLookupError } = await emailDb
    .from("email_unsubscribe_tokens")
    .select("token, used_at")
    .eq("email", normalizedRecipient)
    .maybeSingle();

  if (tokenLookupError) throw tokenLookupError;
  if (existingToken?.used_at) return null;

  let unsubscribeToken = existingToken?.token as string | undefined;
  if (!unsubscribeToken) {
    const candidateToken = generateToken();
    const { error: tokenInsertError } = await emailDb
      .from("email_unsubscribe_tokens")
      .upsert(
        { token: candidateToken, email: normalizedRecipient },
        { onConflict: "email", ignoreDuplicates: true },
      );
    if (tokenInsertError) throw tokenInsertError;

    const { data: storedToken, error: storedTokenError } = await emailDb
      .from("email_unsubscribe_tokens")
      .select("token, used_at")
      .eq("email", normalizedRecipient)
      .maybeSingle();
    if (storedTokenError || !storedToken?.token) {
      throw storedTokenError ?? new Error("Failed to prepare notification email");
    }
    if (storedToken.used_at) return null;
    unsubscribeToken = storedToken.token;
  }

  await emailDb.from("email_send_log").insert({
    message_id: messageId,
    template_name: templateName,
    recipient_email: recipient,
    status: "pending",
  });

  const { error } = await emailDb.rpc("enqueue_email", {
    queue_name: "transactional_emails",
    payload: {
      message_id: messageId,
      to: recipient,
      from: getLeadmapEmailFrom(),
      sender_domain: getLeadmapEmailSenderDomain(),
      subject,
      html,
      text,
      purpose: "transactional",
      label: templateName,
      idempotency_key: messageId,
      unsubscribe_token: unsubscribeToken,
      queued_at: new Date().toISOString(),
    },
  });

  if (error) {
    await emailDb.from("email_send_log").insert({
      message_id: messageId,
      template_name: templateName,
      recipient_email: recipient,
      status: "failed",
      error_message: "Failed to enqueue email",
    });
    throw error;
  }

  return messageId;
}
