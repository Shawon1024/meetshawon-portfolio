export type SiteOperatingMode =
  | "normal"
  | "scheduled"
  | "site_maintenance"
  | "drive_maintenance"
  | "full_maintenance";

interface SiteStatusConfiguration {
  mode: SiteOperatingMode;

  generalNotice: {
    enabled: boolean;
    label: string;
    message: string;
  };

  maintenance: {
    title: string;
    summary: string;
    startsAt: string;
    expectedReturnAt: string;
    timezone: string;
    reason: string;
    progressMessage: string;
    plannedChanges: string[];
    contactPath: string;
  };
}

// ==================================================
// WEBSITE AND SERVICE STATUS — OPERATING GUIDE
// ==================================================
//
// Change only `mode` to select the operating state:
//
// "normal"
//   Website and Drive are available.
//
// "scheduled"
//   Everything remains available and a scheduled
//   website-maintenance announcement is displayed.
//
// "site_maintenance"
//   The main website is under maintenance.
//   Drive remains available.
//
// "drive_maintenance"
//   Drive is under maintenance.
//   The main website remains available.
//
// "full_maintenance"
//   The website and Drive are under maintenance.
//
// The General Notice is controlled independently:
//
//   generalNotice.enabled: true
//
// displays the website update and responsible-use
// notice whenever the main website is available.
// Change it to false to hide only that notice.
//
// ==================================================
// DATE AND TIME FORMAT
// ==================================================
//
// British Summer Time example:
//   2026-09-12T22:00:00+01:00
//
// Greenwich Mean Time example:
//   2026-12-12T22:00:00+00:00
//
// ==================================================
// QUICK WORKFLOW
// ==================================================
//
// Normal operation:
//   mode: "normal"
//
// Announce planned website work:
//   mode: "scheduled"
//
// Start maintenance for one scope:
//   mode: "site_maintenance"
//   mode: "drive_maintenance"
//
// Start maintenance everywhere:
//   mode: "full_maintenance"
//
// Finish any maintenance:
//   mode: "normal"
//
// After changing the configuration, commit and deploy.
// ==================================================

export const SITE_STATUS: SiteStatusConfiguration = {
  mode: "normal",

  generalNotice: {
    // Independent General Notice switch.
    enabled: true,

    label: "Website update notice:",

    message:
      "This website is undergoing continued refinement, so some content may be incomplete or change. Cybersecurity material is provided for educational and authorised defensive use only.",
  },

  maintenance: {
    title: "Scheduled website maintenance",

    summary:
      "The selected Meet Shawon service is temporarily unavailable while planned improvements are being completed.",

    startsAt: "2026-09-12T22:00:00+01:00",

    expectedReturnAt: "2026-09-13T01:00:00+01:00",

    timezone: "Europe/London",

    reason:
      "Planned maintenance is being carried out to improve reliability, security, and functionality.",

    progressMessage:
      "Work is currently in progress. The affected service will be restored as quickly and safely as possible.",

    plannedChanges: [
      "Security and dependency updates",
      "Performance and reliability improvements",
      "Application and infrastructure maintenance",
    ],

    // Absolute URL so it also works from service subdomains.
    contactPath: "https://meetshawon.com/contact",
  },
};

// ==================================================
// END WEBSITE AND SERVICE STATUS CONFIGURATION
// ==================================================
