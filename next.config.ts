import type {
  NextConfig,
} from "next";

const isDev =
  process.env.NODE_ENV ===
  "development";

const contentSecurityPolicy = `
  default-src 'self';

  script-src
    'self'
    'unsafe-inline'
    https://challenges.cloudflare.com
    ${isDev ? "'unsafe-eval'" : ""};

  frame-src
    'self'
    https://challenges.cloudflare.com;

  style-src
    'self'
    'unsafe-inline';

  img-src
    'self'
    blob:
    data:
    https:;

  font-src
    'self'
    data:;

  connect-src
    'self'
    https://*.supabase.co
    wss://*.supabase.co
    https://photon.komoot.io;

  media-src
    'self'
    https:;

  object-src
    'none';

  base-uri
    'self';

  form-action
    'self';

  frame-ancestors
    'none';

  upgrade-insecure-requests;
`
  .replace(
    /\s{2,}/g,
    " ",
  )
  .trim();

const securityHeaders = [
  {
    key:
      "Content-Security-Policy",
    value:
      contentSecurityPolicy,
  },

  {
    key:
      "X-Content-Type-Options",
    value:
      "nosniff",
  },

  {
    key:
      "X-Frame-Options",
    value:
      "DENY",
  },

  {
    key:
      "Referrer-Policy",
    value:
      "strict-origin-when-cross-origin",
  },

  {
    key:
      "Permissions-Policy",
    value:
      "camera=(), microphone=(), geolocation=()",
  },

  {
    key:
      "Cross-Origin-Opener-Policy",
    value:
      "same-origin",
  },

  {
    key:
      "X-DNS-Prefetch-Control",
    value:
      "on",
  },
];

const nextConfig:
  NextConfig = {
  reactCompiler:
    true,

  async headers() {
    return [
      {
        source:
          "/(.*)",

        headers:
          securityHeaders,
      },
    ];
  },
};

export default nextConfig;