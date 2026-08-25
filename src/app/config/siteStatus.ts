export type SiteOperatingMode =
  | "normal"
  | "scheduled"
  | "maintenance";

interface SiteStatusConfiguration {
  mode:
    SiteOperatingMode;

  constructionNotice: {
    enabled:
      boolean;

    label:
      string;

    message:
      string;
  };

  maintenance: {
    title:
      string;

    summary:
      string;

    startsAt:
      string;

    expectedReturnAt:
      string;

    timezone:
      string;

    reason:
      string;

    progressMessage:
      string;

    plannedChanges:
      string[];

    availableServices:
      string[];

    contactPath:
      string;
  };
}

// ==================================================
// WEBSITE STATUS — COMPLETE OPERATING GUIDE
// ==================================================
//
// This is the main control file for website notices
// and maintenance mode.
//
// You normally only need to edit this file.
//
// ==================================================
// MODE 1: NORMAL OPERATION
// ==================================================
//
// Use:
//
//   mode: "normal",
//
// Result:
//
// - The complete website is available.
// - The construction notice is controlled by
//   `constructionNotice.enabled`.
// - The maintenance page is not shown.
//
// ==================================================
// MODE 2: ANNOUNCE SCHEDULED MAINTENANCE
// ==================================================
//
// Use:
//
//   mode: "scheduled",
//
// Before deploying:
//
// 1. Enter the real maintenance start time.
// 2. Enter the expected return time.
// 3. Update the reason.
// 4. Update the planned changes.
// 5. Commit and deploy.
//
// Result:
//
// - The complete website remains available.
// - A scheduled-maintenance notice appears.
// - Visitors can see when maintenance will begin.
// - Visitors can see the expected return time.
//
// ==================================================
// MODE 3: START FULL MAINTENANCE
// ==================================================
//
// At the scheduled maintenance time, change:
//
//   mode: "scheduled",
//
// to:
//
//   mode: "maintenance",
//
// Then commit and deploy.
//
// Result:
//
// - Main website pages become unavailable.
// - Visitors see the maintenance page.
// - Newsletter features become unavailable.
// - Contact and the urgent contact form remain active.
// - drive.meetshawon.com remains unaffected.
// - The health endpoint remains available for checks.
//
// ==================================================
// FINISH MAINTENANCE
// ==================================================
//
// When maintenance is complete, change:
//
//   mode: "maintenance",
//
// to:
//
//   mode: "normal",
//
// Update any information that changed, then commit
// and deploy.
//
// The complete website becomes available again.
//
// ==================================================
// DATE AND TIME FORMAT
// ==================================================
//
// Use an ISO date with the correct UK time offset.
//
// British Summer Time example:
//
//   2026-09-12T22:00:00+01:00
//
// Greenwich Mean Time example:
//
//   2026-12-12T22:00:00+00:00
//
// Check whether the scheduled date falls under BST
// or GMT before entering it.
//
// ==================================================
// CONSTRUCTION NOTICE
// ==================================================
//
// In normal mode:
//
//   enabled: true,
//
// displays the temporary website-refinement notice.
//
// Change it to:
//
//   enabled: false,
//
// when that notice is no longer needed.
//
// ==================================================
// QUICK WORKFLOW
// ==================================================
//
// ANNOUNCE:
// mode = "scheduled" → commit → deploy
//
// START:
// mode = "maintenance" → commit → deploy
//
// FINISH:
// mode = "normal" → commit → deploy
//
// Search for "WEBSITE STATUS" to find this file.
//
// ==================================================

export const SITE_STATUS:
  SiteStatusConfiguration = {
  // "normal"      = complete website available
  // "scheduled"   = website available with announcement
  // "maintenance" = maintenance page replaces main site
  mode:
    "normal",

  constructionNotice: {
    // Used only while mode is "normal".
    enabled:
      true,

    label:
      "Website update notice:",

    message:
      "This website is undergoing continued refinement, so some content may be incomplete or change. Cybersecurity material is provided for educational and authorised defensive use only.",
  },

  maintenance: {
    title:
      "Scheduled website maintenance",

    summary:
      "Meet Shawon is temporarily unavailable while planned improvements are being completed.",

    startsAt:
      "2026-09-12T22:00:00+01:00",

    expectedReturnAt:
      "2026-09-13T01:00:00+01:00",

    timezone:
      "Europe/London",

    reason:
      "Planned maintenance is being carried out to improve website reliability, security, and functionality.",

    progressMessage:
      "Work is currently in progress. I will restore the website as quickly and safely as possible.",

    plannedChanges: [
      "Security and dependency updates",
      "Performance and reliability improvements",
      "Application and infrastructure maintenance",
    ],

    availableServices: [
      "Urgent contact form",
      "Meet Shawon Drive for authorised users",
    ],

    contactPath:
      "/contact",
  },
};

// ==================================================
// END WEBSITE STATUS CONFIGURATION
// ==================================================