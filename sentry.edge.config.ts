import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn:
    "https://495176eaa78c8cf5bcf58d4fc7229304@o4511928617730048.ingest.de.sentry.io/4511928621400144",

  tracesSampleRate:
    process.env.NODE_ENV ===
    "production"
      ? 0.1
      : 1,

  enableLogs: true,

  dataCollection: {
    userInfo: false,
    httpBodies: [],
  },
});