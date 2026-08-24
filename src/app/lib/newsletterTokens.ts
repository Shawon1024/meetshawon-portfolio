import {
  createHmac,
  timingSafeEqual,
} from "node:crypto";

export type NewsletterTokenPurpose =
  | "confirm"
  | "unsubscribe";

interface NewsletterTokenPayload {
  email: string;
  purpose: NewsletterTokenPurpose;
  expiresAt: number | null;
}

function getTokenSecret() {
  const secret =
    process.env.NEWSLETTER_TOKEN_SECRET;

  if (!secret) {
    throw new Error(
      "NEWSLETTER_TOKEN_SECRET is not configured.",
    );
  }

  return secret;
}

function signPayload(
  encodedPayload: string,
) {
  return createHmac(
    "sha256",
    getTokenSecret(),
  )
    .update(encodedPayload)
    .digest("base64url");
}

export function createNewsletterToken(
  email: string,
  purpose: NewsletterTokenPurpose,
) {
  const payload: NewsletterTokenPayload = {
    email:
      email.trim().toLowerCase(),

    purpose,

    expiresAt:
      purpose === "confirm"
        ? Date.now() +
          24 * 60 * 60 * 1000
        : null,
  };

  const encodedPayload =
    Buffer.from(
      JSON.stringify(payload),
      "utf8",
    ).toString("base64url");

  const signature =
    signPayload(encodedPayload);

  return `${encodedPayload}.${signature}`;
}

export function verifyNewsletterToken(
  token: string,
  expectedPurpose: NewsletterTokenPurpose,
) {
  try {
    const [
      encodedPayload,
      suppliedSignature,
    ] = token.split(".");

    if (
      !encodedPayload ||
      !suppliedSignature
    ) {
      return null;
    }

    const expectedSignature =
      signPayload(encodedPayload);

    const suppliedBuffer =
      Buffer.from(
        suppliedSignature,
        "utf8",
      );

    const expectedBuffer =
      Buffer.from(
        expectedSignature,
        "utf8",
      );

    if (
      suppliedBuffer.length !==
      expectedBuffer.length
    ) {
      return null;
    }

    if (
      !timingSafeEqual(
        suppliedBuffer,
        expectedBuffer,
      )
    ) {
      return null;
    }

    const payload =
      JSON.parse(
        Buffer.from(
          encodedPayload,
          "base64url",
        ).toString("utf8"),
      ) as NewsletterTokenPayload;

    if (
      !payload.email ||
      payload.purpose !==
        expectedPurpose
    ) {
      return null;
    }

    if (
      payload.expiresAt !== null &&
      Date.now() >
        payload.expiresAt
    ) {
      return null;
    }

    return payload.email
      .trim()
      .toLowerCase();
  } catch {
    return null;
  }
}