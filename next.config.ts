import { withSentryConfig } from "@sentry/nextjs";
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

  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname:
          "**.supabase.co",
        pathname:
          "/storage/v1/object/public/**",
      },
    ],
  },

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

export default withSentryConfig(nextConfig, {
  // For all available options, see:
  // https://www.npmjs.com/package/@sentry/webpack-plugin#options

  org: "meetshawoncom",

  project: "meetshawon-portfolio",

  // Only print logs for uploading source maps in CI
  silent: !process.env.CI,

  // For all available options, see:
  // https://docs.sentry.io/platforms/javascript/guides/nextjs/manual-setup/

  // Upload a larger set of source maps for prettier stack traces (increases build time)
  widenClientFileUpload: true,

  // Route browser requests to Sentry through a Next.js rewrite to circumvent ad-blockers.
  // This can increase your server load as well as your hosting bill.
  // Note: Check that the configured route will not match with your Next.js middleware, otherwise reporting of client-
  // side errors will fail.
  tunnelRoute: "/monitoring",

  webpack: {
    // Enables automatic instrumentation of Vercel Cron Monitors. (Does not yet work with App Router route handlers.)
    // See the following for more information:
    // https://docs.sentry.io/product/crons/
    // https://vercel.com/docs/cron-jobs
    automaticVercelMonitors: false,

    // Tree-shaking options for reducing bundle size
    treeshake: {
      // Automatically tree-shake Sentry logger statements to reduce bundle size
      removeDebugLogging: true,
    },
  },
});
