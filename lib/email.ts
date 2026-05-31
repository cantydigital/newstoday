import { Resend } from "resend"

const apiKey = process.env.RESEND_API_KEY
const FROM_EMAIL =
  process.env.RESEND_FROM_EMAIL || "News Today <noreply@newstoday.com.au>"

const resend = apiKey ? new Resend(apiKey) : null

export type PressReleasePublishedEmail = {
  to: string
  authorName: string
  pressReleaseTitle: string
  liveUrl: string
}

/**
 * Notify the press release author that their submission is now live.
 * Silently no-ops (with a console.warn) if RESEND_API_KEY isn't set, so that
 * publishing still succeeds in environments without email configured.
 */
export async function sendPressReleasePublishedEmail(
  params: PressReleasePublishedEmail
): Promise<{ sent: boolean; reason?: string }> {
  if (!resend) {
    console.warn(
      "[email] RESEND_API_KEY not configured -- skipping publish notification"
    )
    return { sent: false, reason: "resend_not_configured" }
  }

  const { to, authorName, pressReleaseTitle, liveUrl } = params

  const subject = `Your press release is now live on News Today`

  const html = `
    <div style="font-family: -apple-system, Segoe UI, Roboto, Helvetica, Arial, sans-serif; max-width: 560px; margin: 0 auto; color: #111;">
      <h1 style="font-size: 22px; margin: 0 0 16px;">Your press release is live</h1>
      <p style="font-size: 15px; line-height: 1.55; margin: 0 0 12px;">
        Hi ${escapeHtml(authorName || "there")},
      </p>
      <p style="font-size: 15px; line-height: 1.55; margin: 0 0 12px;">
        Great news — your press release <strong>"${escapeHtml(
          pressReleaseTitle
        )}"</strong> has been approved by our editorial team and is now
        published on News Today.
      </p>
      <p style="font-size: 15px; line-height: 1.55; margin: 0 0 20px;">
        You can view it here:
      </p>
      <p style="margin: 0 0 24px;">
        <a href="${liveUrl}"
           style="display:inline-block;background:#111;color:#fff;text-decoration:none;padding:12px 18px;border-radius:6px;font-size:14px;">
          View live press release
        </a>
      </p>
      <p style="font-size: 13px; line-height: 1.5; color: #555; margin: 0 0 6px;">
        Live URL: <a href="${liveUrl}">${liveUrl}</a>
      </p>
      <hr style="border:none;border-top:1px solid #eee;margin:24px 0;" />
      <p style="font-size: 12px; line-height: 1.5; color: #888;">
        News Today — Australian news, every day.<br />
        If you have any questions, just reply to this email.
      </p>
    </div>
  `

  const text = [
    `Hi ${authorName || "there"},`,
    "",
    `Your press release "${pressReleaseTitle}" has been approved and is now live on News Today.`,
    "",
    `View it here: ${liveUrl}`,
    "",
    "— News Today",
  ].join("\n")

  try {
    const result = await resend.emails.send({
      from: FROM_EMAIL,
      to,
      subject,
      html,
      text,
    })

    if (result.error) {
      console.error("[email] resend send failed", result.error)
      return { sent: false, reason: result.error.message }
    }

    return { sent: true }
  } catch (err) {
    console.error("[email] resend send threw", err)
    return { sent: false, reason: (err as Error).message }
  }
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;")
}
