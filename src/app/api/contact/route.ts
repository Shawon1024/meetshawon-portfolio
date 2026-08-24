import { NextResponse } from "next/server";
import { Resend } from "resend";

interface ContactRequest {
  name?: string;
  email?: string;
  subject?: string;
  message?: string;
  turnstileToken?: string;
}

interface TurnstileResponse {
  success: boolean;
  hostname?: string;
  action?: string;
  "error-codes"?: string[];
}

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function jsonResponse(
  body: Record<string, unknown>,
  status: number,
) {
  return NextResponse.json(body, {
    status,
    headers: {
      "Cache-Control": "no-store",
    },
  });
}

export async function POST(request: Request) {
  try {
    const resendApiKey = process.env.RESEND_API_KEY;
    const destination = process.env.CONTACT_EMAIL;
    const turnstileSecret =
      process.env.TURNSTILE_SECRET_KEY;

    if (
      !resendApiKey ||
      !destination ||
      !turnstileSecret
    ) {
      console.error(
        "Contact form server configuration is incomplete.",
      );

      return jsonResponse(
        {
          error:
            "The contact form is currently unavailable.",
        },
        500,
      );
    }

    let body: ContactRequest;

    try {
      body = (await request.json()) as ContactRequest;
    } catch {
      return jsonResponse(
        {
          error: "The submitted request is invalid.",
        },
        400,
      );
    }

    const name = body.name?.trim() ?? "";
    const email =
      body.email?.trim().toLowerCase() ?? "";
    const subject = body.subject?.trim() ?? "";
    const message = body.message?.trim() ?? "";
    const turnstileToken =
      body.turnstileToken?.trim() ?? "";

    if (
      !name ||
      !email ||
      !subject ||
      !message ||
      !turnstileToken
    ) {
      return jsonResponse(
        {
          error:
            "Please complete every field and human verification.",
        },
        400,
      );
    }

    if (
      name.length > 100 ||
      email.length > 254 ||
      subject.length > 150 ||
      message.length > 5000 ||
      turnstileToken.length > 2048
    ) {
      return jsonResponse(
        {
          error: "One or more fields are invalid.",
        },
        400,
      );
    }

    const emailPattern =
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailPattern.test(email)) {
      return jsonResponse(
        {
          error: "Please enter a valid email address.",
        },
        400,
      );
    }

    const forwardedFor =
      request.headers.get("x-forwarded-for");

    const remoteIp = forwardedFor
      ?.split(",")[0]
      ?.trim();

    const verificationBody = new URLSearchParams({
      secret: turnstileSecret,
      response: turnstileToken,
    });

    if (remoteIp) {
      verificationBody.set("remoteip", remoteIp);
    }

    let turnstileResult: TurnstileResponse;

    try {
      const verificationResponse = await fetch(
        "https://challenges.cloudflare.com/turnstile/v0/siteverify",
        {
          method: "POST",
          headers: {
            "Content-Type":
              "application/x-www-form-urlencoded",
          },
          body: verificationBody,
          cache: "no-store",
          signal: AbortSignal.timeout(10_000),
        },
      );

      if (!verificationResponse.ok) {
        throw new Error(
          `Turnstile verification returned ${verificationResponse.status}`,
        );
      }

      turnstileResult =
        (await verificationResponse.json()) as TurnstileResponse;
    } catch (verificationError) {
      console.error(
        "Turnstile verification request failed:",
        verificationError,
      );

      return jsonResponse(
        {
          error:
            "Human verification could not be completed. Please try again.",
        },
        403,
      );
    }

    const allowedHostnames = new Set([
      "meetshawon.com",
      "www.meetshawon.com",
      "localhost",
    ]);

    if (
      !turnstileResult.success ||
      !turnstileResult.hostname ||
      !allowedHostnames.has(turnstileResult.hostname)
    ) {
      console.warn("Turnstile validation rejected.", {
        hostname: turnstileResult.hostname ?? null,
        errorCodes:
          turnstileResult["error-codes"] ?? [],
      });

      return jsonResponse(
        {
          error:
            "Human verification failed. Please try again.",
        },
        403,
      );
    }

    const cleanSubject = subject
      .replace(/[\r\n]+/g, " ")
      .replace(/\s+/g, " ")
      .trim();

    const safeName = escapeHtml(name);
    const safeEmail = escapeHtml(email);
    const safeSubject = escapeHtml(cleanSubject);
    const safeMessage = escapeHtml(message).replaceAll(
      "\n",
      "<br />",
    );

    const receivedAt = new Intl.DateTimeFormat(
      "en-GB",
      {
        dateStyle: "full",
        timeStyle: "short",
        timeZone: "Europe/London",
      },
    ).format(new Date());

    const replyUrl = escapeHtml(
      `mailto:${email}?subject=${encodeURIComponent(
        `Re: ${cleanSubject}`,
      )}`,
    );

    const resend = new Resend(resendApiKey);

    const { error } = await resend.emails.send({
      from:
        "Meet Shawon Portfolio <contact@meetshawon.com>",
      to: [destination],
      subject: `Meet Shawon: ${cleanSubject}`,

      text: [
        "New contact form message",
        "",
        "Message:",
        message,
        "",
        "Name:",
        name,
        "",
        "Email:",
        email,
        "",
        `Received: ${receivedAt}`,
        "Source: https://meetshawon.com/contact",
      ].join("\n"),

      html: `
        <!doctype html>
        <html lang="en">
          <head>
            <meta charset="utf-8" />
            <meta name="viewport" content="width=device-width" />
            <title>New contact form message</title>
          </head>

          <body
            style="
              margin:0;
              padding:0;
              background:#041c18;
              color:#e5e7eb;
            "
          >
            <div
              style="
                display:none;
                max-height:0;
                overflow:hidden;
                opacity:0;
              "
            >
              New message from ${safeName}: ${safeSubject}
            </div>

            <table
              role="presentation"
              width="100%"
              cellspacing="0"
              cellpadding="0"
              border="0"
              style="
                width:100%;
                background:#041c18;
                font-family:Arial,Helvetica,sans-serif;
              "
            >
              <tr>
                <td
                  align="center"
                  style="padding:32px 16px;"
                >
                  <table
                    role="presentation"
                    width="100%"
                    cellspacing="0"
                    cellpadding="0"
                    border="0"
                    style="
                      width:100%;
                      max-width:640px;
                      overflow:hidden;
                      border:1px solid #1f3b35;
                      border-radius:20px;
                      background:#092923;
                    "
                  >
                    <tr>
                      <td
                        style="
                          padding:30px;
                          border-bottom:1px solid #1f3b35;
                          background:#06352b;
                        "
                      >
                        <p
                          style="
                            margin:0 0 10px;
                            color:#4ade80;
                            font-size:12px;
                            font-weight:700;
                            letter-spacing:2px;
                            text-transform:uppercase;
                          "
                        >
                          Meet Shawon
                        </p>

                        <h1
                          style="
                            margin:0;
                            color:#ffffff;
                            font-size:26px;
                            line-height:1.3;
                          "
                        >
                          New contact form message
                        </h1>

                        <p
                          style="
                            margin:10px 0 0;
                            color:#a7b7b2;
                            font-size:15px;
                            line-height:1.6;
                          "
                        >
                          ${safeSubject}
                        </p>
                      </td>
                    </tr>

                    <tr>
                      <td style="padding:30px;">
                        <p
                          style="
                            margin:0 0 10px;
                            color:#7f9b92;
                            font-size:12px;
                            font-weight:700;
                            letter-spacing:1px;
                            text-transform:uppercase;
                          "
                        >
                          Message
                        </p>

                        <div
                          style="
                            padding:18px;
                            border-left:3px solid #22c55e;
                            border-radius:8px;
                            background:#061f1a;
                            color:#d1d5db;
                            font-size:15px;
                            line-height:1.8;
                          "
                        >
                          ${safeMessage}
                        </div>

                        <p
                          style="
                            margin:24px 0 6px;
                            color:#7f9b92;
                            font-size:12px;
                            font-weight:700;
                            letter-spacing:1px;
                            text-transform:uppercase;
                          "
                        >
                          Name
                        </p>

                        <p
                          style="
                            margin:0;
                            color:#ffffff;
                            font-size:16px;
                            font-weight:700;
                          "
                        >
                          ${safeName}
                        </p>

                        <p
                          style="
                            margin:20px 0 6px;
                            color:#7f9b92;
                            font-size:12px;
                            font-weight:700;
                            letter-spacing:1px;
                            text-transform:uppercase;
                          "
                        >
                          Email
                        </p>

                        <p
                          style="
                            margin:0;
                            color:#4ade80;
                            font-size:15px;
                          "
                        >
                          ${safeEmail}
                        </p>

                        <table
                          role="presentation"
                          cellspacing="0"
                          cellpadding="0"
                          border="0"
                          style="margin-top:26px;"
                        >
                          <tr>
                            <td
                              style="
                                border-radius:10px;
                                background:#22c55e;
                              "
                            >
                              <a
                                href="${replyUrl}"
                                style="
                                  display:inline-block;
                                  padding:13px 20px;
                                  color:#03120e;
                                  font-size:14px;
                                  font-weight:700;
                                  text-decoration:none;
                                "
                              >
                                Reply to ${safeName}
                              </a>
                            </td>
                          </tr>
                        </table>
                      </td>
                    </tr>

                    <tr>
                      <td
                        style="
                          padding:20px 30px;
                          border-top:1px solid #1f3b35;
                          color:#7f9b92;
                          font-size:12px;
                          line-height:1.7;
                        "
                      >
                        Received: ${receivedAt}<br />
                        Source: meetshawon.com/contact
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

    if (error) {
      console.error("Resend error:", error);

      return jsonResponse(
        {
          error: "The message could not be sent.",
        },
        500,
      );
    }

    return jsonResponse(
      {
        success: true,
      },
      200,
    );
  } catch (error) {
    console.error("Contact route error:", error);

    return jsonResponse(
      {
        error: "An unexpected error occurred.",
      },
      500,
    );
  }
}