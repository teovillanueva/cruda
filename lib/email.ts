import { Resend } from "resend";
import ResetPasswordEmail from "@/emails/reset-password";

const apiKey = process.env.RESEND_API_KEY;
const from = process.env.EMAIL_FROM ?? "cruda <onboarding@resend.dev>";

const resend = apiKey ? new Resend(apiKey) : null;

export async function sendResetPasswordEmail({
  to,
  url,
}: {
  to: string;
  url: string;
}) {
  if (!resend) {
    console.log(`[email] (no RESEND_API_KEY) reset → ${to}: ${url}`);
    return;
  }
  const { error } = await resend.emails.send({
    from,
    to,
    subject: "tu link para volver a entrar",
    react: ResetPasswordEmail({ url }),
  });
  if (error) console.error("[email] reset failed:", error);
}
