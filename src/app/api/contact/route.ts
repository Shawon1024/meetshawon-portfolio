import {
  NextResponse,
} from "next/server";
import {
  Resend,
} from "resend";

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

function escapeHtml(
  value: string,
) {
  return value
    .replaceAll(
      "&",
      "&amp;",
    )
    .replaceAll(
      "<",
      "&lt;",
    )
    .replaceAll(
      ">",
      "&gt;",
    )
    .replaceAll(
      '"',
      "&quot;",
    )
    .replaceAll(
      "'",
      "&#039;",
    );
}

function jsonResponse(
  body: Record<
    string,
    unknown
  >,
  status: number,
) {
  return NextResponse.json(
    body,
    {
      status,

      headers: {
        "Cache-Control":
          "no-store",
      },
    },
  );
}

export async function POST(
  request: Request,
) {
  try {
    // --------------------------------------------------
    // ENVIRONMENT
    // --------------------------------------------------

    const resendApiKey =
      process.env
        .RESEND_API_KEY;

    const destination =
      process.env
        .CONTACT_EMAIL;

    const turnstileSecret =
      process.env
        .TURNSTILE_SECRET_KEY;

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

    // --------------------------------------------------
    // PARSE REQUEST
    // --------------------------------------------------

    const body =
      (await request.json()) as
        ContactRequest;

    const name =
      body.name?.trim() ??
      "";

    const email =
      body.email?.trim() ??
      "";

    const subject =
      body.subject?.trim() ??
      "";

    const message =
      body.message?.trim() ??
      "";

    const turnstileToken =
      body.turnstileToken?.trim() ??
      "";

    // --------------------------------------------------
    // REQUIRED FIELDS
    // --------------------------------------------------

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

    // --------------------------------------------------
    // INPUT LENGTHS
    // --------------------------------------------------

    if (
      name.length >
        100 ||
      email.length >
        254 ||
      subject.length >
        150 ||
      message.length >
        5000 ||
      turnstileToken.length >
        2048
    ) {
      return jsonResponse(
        {
          error:
            "One or more fields are invalid.",
        },
        400,
      );
    }

    // --------------------------------------------------
    // EMAIL FORMAT
    // --------------------------------------------------

    const emailPattern =
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (
      !emailPattern.test(
        email,
      )
    ) {
      return jsonResponse(
        {
          error:
            "Please enter a valid email address.",
        },
        400,
      );
    }

    // --------------------------------------------------
    // TURNSTILE VALIDATION
    // --------------------------------------------------

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

    if (
      remoteIp
    ) {
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
          `Turnstile verification returned ${verificationResponse.status}`,
        );
      }

      turnstileResult =
        (await verificationResponse.json()) as
          TurnstileResponse;
    } catch (
      verificationError
    ) {
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

    // --------------------------------------------------
    // VERIFY RESULT + HOSTNAME
    // --------------------------------------------------

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
        "Turnstile validation rejected.",
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
            "Human verification failed. Please try again.",
        },
        403,
      );
    }

    // --------------------------------------------------
    // ESCAPE USER CONTENT
    // --------------------------------------------------

    const safeName =
      escapeHtml(
        name,
      );

    const safeEmail =
      escapeHtml(
        email,
      );

    const safeSubject =
      escapeHtml(
        subject,
      );

    const safeMessage =
      escapeHtml(
        message,
      ).replaceAll(
        "\n",
        "<br />",
      );

    // --------------------------------------------------
    // RESEND
    // --------------------------------------------------

    const resend =
      new Resend(
        resendApiKey,
      );

    const {
      data,
      error,
    } =
      await resend.emails.send(
        {
          from:
            "Meet Shawon <contact@meetshawon.com>",

          to: [
            destination,
          ],

          replyTo:
            email,

          subject:
            `Portfolio enquiry: ${subject}`,

          html: `
            <div style="font-family: Arial, sans-serif; line-height: 1.6;">
              <h2>New portfolio contact message</h2>

              <p><strong>Name:</strong> ${safeName}</p>
              <p><strong>Email:</strong> ${safeEmail}</p>
              <p><strong>Subject:</strong> ${safeSubject}</p>

              <hr />

              <p><strong>Message:</strong></p>
              <p>${safeMessage}</p>
            </div>
          `,
        },
      );

    if (
      error
    ) {
      console.error(
        "Resend error:",
        error,
      );

      return jsonResponse(
        {
          error:
            "The message could not be sent.",
        },
        500,
      );
    }

    return jsonResponse(
      {
        success:
          true,

        id:
          data?.id,
      },
      200,
    );
  } catch (
    error
  ) {
    console.error(
      "Contact route error:",
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