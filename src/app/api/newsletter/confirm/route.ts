import {
  createClient,
} from "@supabase/supabase-js";
import {
  NextResponse,
} from "next/server";
import {
  Resend,
} from "resend";

import {
  createNewsletterToken,
  verifyNewsletterToken,
} from "../../../lib/newsletterTokens";

export const runtime = "nodejs";

function redirectToResult(
  request: Request,
  status: string,
) {
  const url =
    new URL(
      "/newsletter/confirmed",
      request.url,
    );

  url.searchParams.set(
    "status",
    status,
  );

  return NextResponse.redirect(
    url,
    {
      status:
        303,

      headers: {
        "Cache-Control":
          "no-store",
      },
    },
  );
}

export async function GET(
  request: Request,
) {
  try {
    const requestUrl =
      new URL(request.url);

    const token =
      requestUrl.searchParams
        .get("token")
        ?.trim() ??
      "";

    if (
      !token ||
      token.length > 4096
    ) {
      return redirectToResult(
        request,
        "invalid",
      );
    }

    const email =
      verifyNewsletterToken(
        token,
        "confirm",
      );

    if (!email) {
      return redirectToResult(
        request,
        "invalid",
      );
    }

    const supabaseUrl =
      process.env
        .NEXT_PUBLIC_SUPABASE_URL;

    const supabaseSecret =
      process.env
        .SUPABASE_SECRET_KEY ??
      process.env
        .SUPABASE_SERVICE_ROLE_KEY;

    if (
      !supabaseUrl ||
      !supabaseSecret
    ) {
      console.error(
        "Newsletter confirmation configuration is incomplete.",
      );

      return redirectToResult(
        request,
        "error",
      );
    }

    const supabaseAdmin =
      createClient(
        supabaseUrl,
        supabaseSecret,
        {
          auth: {
            autoRefreshToken:
              false,

            persistSession:
              false,
          },
        },
      );

    const {
      data: subscriber,
      error: lookupError,
    } =
      await supabaseAdmin
        .from(
          "newsletter_subscribers",
        )
        .select("status")
        .eq("email", email)
        .maybeSingle<{
          status: string;
        }>();

    if (
      lookupError ||
      !subscriber
    ) {
      console.error(
        "Newsletter confirmation lookup failed:",
        lookupError,
      );

      return redirectToResult(
        request,
        "invalid",
      );
    }

    if (
      subscriber.status ===
      "subscribed"
    ) {
      return redirectToResult(
        request,
        "already-confirmed",
      );
    }

    if (
      subscriber.status !==
      "pending"
    ) {
      return redirectToResult(
        request,
        "invalid",
      );
    }

    const now =
      new Date().toISOString();

    const {
      error: updateError,
    } =
      await supabaseAdmin
        .from(
          "newsletter_subscribers",
        )
        .update({
          status:
            "subscribed",

          confirmed_at:
            now,

          unsubscribed_at:
            null,

          updated_at:
            now,
        })
        .eq("email", email);

    if (updateError) {
      console.error(
        "Newsletter confirmation update failed:",
        updateError,
      );

      return redirectToResult(
        request,
        "error",
      );
    }

    const resendApiKey =
      process.env.RESEND_API_KEY;

    if (resendApiKey) {
      const siteUrl =
        process.env
          .NEXT_PUBLIC_SITE_URL ??
        "https://meetshawon.com";

      const unsubscribeToken =
        createNewsletterToken(
          email,
          "unsubscribe",
        );

      const unsubscribeUrl =
        new URL(
          "/newsletter/unsubscribe",
          siteUrl,
        );

      unsubscribeUrl.searchParams.set(
        "token",
        unsubscribeToken,
      );

      const resend =
        new Resend(
          resendApiKey,
        );

      const {
        error: welcomeError,
      } =
        await resend.emails.send({
          from:
            "Meet Shawon Newsletter <contact@meetshawon.com>",

          to: [
            email,
          ],

          subject:
            "Welcome to the Meet Shawon newsletter",

          text: [
            "Your subscription is confirmed.",
            "",
            "You will receive occasional updates about cybersecurity projects, technical articles, qualifications, and platform development.",
            "",
            `Visit Meet Shawon: ${siteUrl}`,
            "",
            `Unsubscribe: ${unsubscribeUrl.toString()}`,
          ].join("\n"),

          html: `
            <!doctype html>
            <html lang="en">
              <body style="margin:0;background:#061916;color:#d1d5db;font-family:Arial,Helvetica,sans-serif;">
                <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:#061916;padding:32px 16px;">
                  <tr>
                    <td align="center">
                      <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:600px;border:1px solid #1f3d36;border-radius:20px;background:#0b2420;overflow:hidden;">
                        <tr>
                          <td style="padding:34px;">
                            <p style="margin:0 0 12px;color:#4ade80;font-size:12px;font-weight:700;letter-spacing:2px;text-transform:uppercase;">
                              Meet Shawon Newsletter
                            </p>

                            <h1 style="margin:0;color:#ffffff;font-size:28px;line-height:1.25;">
                              Subscription confirmed
                            </h1>

                            <p style="margin:20px 0 0;color:#a7b2ae;font-size:16px;line-height:1.7;">
                              Welcome. You will receive occasional updates about cybersecurity projects, technical articles, qualifications, and platform development.
                            </p>

                            <div style="margin:30px 0;">
                              <a
                                href="${siteUrl}"
                                style="display:inline-block;border-radius:12px;background:#22c55e;padding:14px 22px;color:#04110d;font-weight:700;text-decoration:none;"
                              >
                                Visit Meet Shawon
                              </a>
                            </div>

                            <p style="margin:0;color:#7f918b;font-size:12px;line-height:1.6;">
                              You subscribed through meetshawon.com.
                              <a href="${unsubscribeUrl.toString()}" style="color:#86efac;">
                                Unsubscribe
                              </a>
                            </p>
                          </td>
                        </tr>
                      </table>
                    </td>
                  </tr>
                </table>
              </body>
            </html>
          `,

          headers: {
            "List-Unsubscribe":
              `<${unsubscribeUrl.toString()}>`,
          },
        });

      if (welcomeError) {
        console.error(
          "Newsletter welcome email failed:",
          welcomeError,
        );
      }
    }

    return redirectToResult(
      request,
      "success",
    );
  } catch (error) {
    console.error(
      "Newsletter confirmation route error:",
      error,
    );

    return redirectToResult(
      request,
      "error",
    );
  }
}