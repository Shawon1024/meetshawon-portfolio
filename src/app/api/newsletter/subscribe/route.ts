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
} from "../../../lib/newsletterTokens";

export const runtime = "nodejs";

interface SubscribeRequest {
  email?: string;
  consent?: boolean;
  turnstileToken?: string;
}

interface TurnstileResponse {
  success: boolean;
  hostname?: string;
  action?: string;
  "error-codes"?: string[];
}

interface SubscriberRecord {
  status:
    | "pending"
    | "subscribed"
    | "unsubscribed";

  confirmation_sent_at:
    | string
    | null;
}

function jsonResponse(
  body: Record<string, unknown>,
  status: number,
) {
  return NextResponse.json(body, {
    status,
    headers: {
      "Cache-Control":
        "no-store",
    },
  });
}

export async function POST(
  request: Request,
) {
  try {
    const supabaseUrl =
      process.env
        .NEXT_PUBLIC_SUPABASE_URL;

    const supabaseSecret =
      process.env
        .SUPABASE_SECRET_KEY ??
      process.env
        .SUPABASE_SERVICE_ROLE_KEY;

    const resendApiKey =
      process.env.RESEND_API_KEY;

    const turnstileSecret =
      process.env
        .TURNSTILE_SECRET_KEY;

    const siteUrl =
      process.env
        .NEXT_PUBLIC_SITE_URL ??
      "https://meetshawon.com";

    if (
      !supabaseUrl ||
      !supabaseSecret ||
      !resendApiKey ||
      !turnstileSecret
    ) {
      console.error(
        "Newsletter configuration is incomplete.",
      );

      return jsonResponse(
        {
          error:
            "Newsletter subscriptions are currently unavailable.",
        },
        500,
      );
    }

    let body: SubscribeRequest;

    try {
      body =
        (await request.json()) as
          SubscribeRequest;
    } catch {
      return jsonResponse(
        {
          error:
            "The submitted request is invalid.",
        },
        400,
      );
    }

    const email =
      body.email
        ?.trim()
        .toLowerCase() ??
      "";

    const turnstileToken =
      body.turnstileToken
        ?.trim() ??
      "";

    if (
      !email ||
      body.consent !== true ||
      !turnstileToken
    ) {
      return jsonResponse(
        {
          error:
            "Enter your email address, provide consent, and complete human verification.",
        },
        400,
      );
    }

    if (
      email.length > 254 ||
      turnstileToken.length >
        2048
    ) {
      return jsonResponse(
        {
          error:
            "The submitted information is invalid.",
        },
        400,
      );
    }

    const emailPattern =
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (
      !emailPattern.test(email)
    ) {
      return jsonResponse(
        {
          error:
            "Enter a valid email address.",
        },
        400,
      );
    }

    const forwardedFor =
      request.headers.get(
        "x-forwarded-for",
      );

    const remoteIp =
      forwardedFor
        ?.split(",")[0]
        ?.trim();

    const verificationBody =
      new URLSearchParams({
        secret:
          turnstileSecret,

        response:
          turnstileToken,
      });

    if (remoteIp) {
      verificationBody.set(
        "remoteip",
        remoteIp,
      );
    }

    let turnstileResult:
      TurnstileResponse;

    try {
      const verificationResponse =
        await fetch(
          "https://challenges.cloudflare.com/turnstile/v0/siteverify",
          {
            method:
              "POST",

            headers: {
              "Content-Type":
                "application/x-www-form-urlencoded",
            },

            body:
              verificationBody,

            cache:
              "no-store",

            signal:
              AbortSignal.timeout(
                10_000,
              ),
          },
        );

      if (
        !verificationResponse.ok
      ) {
        throw new Error(
          `Turnstile returned ${verificationResponse.status}`,
        );
      }

      turnstileResult =
        (await verificationResponse.json()) as
          TurnstileResponse;
    } catch (
      verificationError
    ) {
      console.error(
        "Newsletter Turnstile request failed:",
        verificationError,
      );

      return jsonResponse(
        {
          error:
            "Human verification could not be completed. Try again.",
        },
        403,
      );
    }

    const allowedHostnames =
      new Set([
        "meetshawon.com",
        "www.meetshawon.com",
        "localhost",
      ]);

    if (
      !turnstileResult.success ||
      !turnstileResult.hostname ||
      !allowedHostnames.has(
        turnstileResult.hostname,
      )
    ) {
      console.warn(
        "Newsletter Turnstile validation rejected.",
        {
          hostname:
            turnstileResult.hostname ??
            null,

          errorCodes:
            turnstileResult[
              "error-codes"
            ] ??
            [],
        },
      );

      return jsonResponse(
        {
          error:
            "Human verification failed. Try again.",
        },
        403,
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

    const pendingCutoff =
        new Date(
            Date.now() -
            30 *
                24 *
                60 *
                60 *
                1000,
        ).toISOString();

    const {
    error: cleanupError,
    } =
    await supabaseAdmin
        .from(
        "newsletter_subscribers",
        )
        .delete()
        .eq(
        "status",
        "pending",
        )
        .lt(
        "created_at",
        pendingCutoff,
        );

    if (cleanupError) {
    console.error(
        "Newsletter pending-record cleanup failed:",
        cleanupError,
    );
    }

    const {
      data: existingSubscriber,
      error: lookupError,
    } =
      await supabaseAdmin
        .from(
          "newsletter_subscribers",
        )
        .select(
          "status, confirmation_sent_at",
        )
        .eq("email", email)
        .maybeSingle<SubscriberRecord>();

    if (lookupError) {
      console.error(
        "Newsletter subscriber lookup failed:",
        lookupError,
      );

      return jsonResponse(
        {
          error:
            "Your subscription could not be processed.",
        },
        500,
      );
    }

    /*
     * Return a neutral success response for an
     * existing confirmed subscriber. This prevents
     * the endpoint from revealing subscription status.
     */
    if (
      existingSubscriber?.status ===
      "subscribed"
    ) {
      return jsonResponse(
        {
          success:
            true,

          message:
            "Check your inbox for subscription instructions.",
        },
        200,
      );
    }

    /*
     * Limit confirmation resends to one every
     * ten minutes for the same email address.
     */
    if (
      existingSubscriber
        ?.confirmation_sent_at
    ) {
      const lastSent =
        new Date(
          existingSubscriber
            .confirmation_sent_at,
        ).getTime();

      const tenMinutes =
        10 * 60 * 1000;

      if (
        Number.isFinite(
          lastSent,
        ) &&
        Date.now() -
          lastSent <
          tenMinutes
      ) {
        return jsonResponse(
          {
            success:
              true,

            message:
              "Check your inbox for subscription instructions.",
          },
          200,
        );
      }
    }

    const consentText =
      "I agree to receive occasional email updates from Meet Shawon about cybersecurity projects, technical articles, qualifications, and platform development.";

    const now =
      new Date().toISOString();

    const {
      error: saveError,
    } =
      await supabaseAdmin
        .from(
          "newsletter_subscribers",
        )
        .upsert(
          {
            email,

            status:
              "pending",

            source:
              "website_footer",

            consent_version:
              "2026-08-24",

            consent_text:
              consentText,

            consented_at:
              now,

            confirmed_at:
              null,

            unsubscribed_at:
              null,

            updated_at:
              now,
          },
          {
            onConflict:
              "email",
          },
        );

    if (saveError) {
      console.error(
        "Newsletter subscriber save failed:",
        saveError,
      );

      return jsonResponse(
        {
          error:
            "Your subscription could not be processed.",
        },
        500,
      );
    }

    const confirmationToken =
      createNewsletterToken(
        email,
        "confirm",
      );

    const confirmationUrl =
      new URL(
        "/api/newsletter/confirm",
        siteUrl,
      );

    confirmationUrl.searchParams.set(
      "token",
      confirmationToken,
    );

    const resend =
      new Resend(
        resendApiKey,
      );

    const {
      error: emailError,
    } =
      await resend.emails.send({
        from:
          "Meet Shawon Newsletter <contact@meetshawon.com>",

        to: [
          email,
        ],

        subject:
          "Confirm your Meet Shawon newsletter subscription",

        text: [
          "Confirm your newsletter subscription",
          "",
          "You requested occasional email updates from Meet Shawon about cybersecurity projects, technical articles, qualifications, and platform development.",
          "",
          `Confirm your subscription: ${confirmationUrl.toString()}`,
          "",
          "This confirmation link expires in 24 hours.",
          "",
          "If you did not request this subscription, you can ignore this email.",
        ].join("\n"),

        html: `
          <!doctype html>
          <html lang="en">
            <body style="margin:0;background:#061916;color:#d1d5db;font-family:Arial,Helvetica,sans-serif;">
              <div style="display:none;max-height:0;overflow:hidden;">
                Confirm your Meet Shawon newsletter subscription.
              </div>

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
                            Confirm your subscription
                          </h1>

                          <p style="margin:20px 0 0;color:#a7b2ae;font-size:16px;line-height:1.7;">
                            You requested occasional updates about cybersecurity projects, technical articles, qualifications, and platform development.
                          </p>

                          <div style="margin:30px 0;">
                            <a
                              href="${confirmationUrl.toString()}"
                              style="display:inline-block;border-radius:12px;background:#22c55e;padding:14px 22px;color:#04110d;font-weight:700;text-decoration:none;"
                            >
                              Confirm subscription
                            </a>
                          </div>

                          <p style="margin:0;color:#7f918b;font-size:13px;line-height:1.6;">
                            This link expires in 24 hours. If you did not request this subscription, simply ignore this email.
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
      });

    if (emailError) {
      console.error(
        "Newsletter confirmation email failed:",
        emailError,
      );

      return jsonResponse(
        {
          error:
            "The confirmation email could not be sent. Try again later.",
        },
        500,
      );
    }

    const {
      error: timestampError,
    } =
      await supabaseAdmin
        .from(
          "newsletter_subscribers",
        )
        .update({
          confirmation_sent_at:
            now,

          updated_at:
            now,
        })
        .eq(
          "email",
          email,
        );

    if (timestampError) {
      console.error(
        "Newsletter confirmation timestamp update failed:",
        timestampError,
      );
    }

    return jsonResponse(
      {
        success:
          true,

        message:
          "Check your inbox and confirm your subscription.",
      },
      200,
    );
  } catch (error) {
    console.error(
      "Newsletter subscription route error:",
      error,
    );

    return jsonResponse(
      {
        error:
          "An unexpected error occurred.",
      },
      500,
    );
  }
}