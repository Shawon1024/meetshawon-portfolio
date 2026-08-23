import crypto from "node:crypto";
import process from "node:process";
import WebSocket from "ws";

// --------------------------------------------------
// ENVIRONMENT
// --------------------------------------------------

function requiredEnv(name) {
  const value = process.env[name]?.trim();

  if (!value) {
    throw new Error(
      `Missing required environment variable: ${name}`,
    );
  }

  return value;
}

function integerEnv(
  name,
  fallback,
) {
  const raw =
    process.env[name];

  if (!raw) {
    return fallback;
  }

  const value =
    Number(raw);

  if (
    !Number.isSafeInteger(
      value,
    )
  ) {
    throw new Error(
      `Invalid integer environment variable: ${name}`,
    );
  }

  return value;
}

function booleanEnv(
  name,
  fallback,
) {
  const raw =
    process.env[name];

  if (!raw) {
    return fallback;
  }

  if (raw === "true") {
    return true;
  }

  if (raw === "false") {
    return false;
  }

  throw new Error(
    `Invalid boolean environment variable: ${name}`,
  );
}

const config = {
  workerName:
    requiredEnv(
      "WORKER_NAME",
    ),

  pollIntervalMs:
    integerEnv(
      "POLL_INTERVAL_MS",
      30000,
    ),

  dryRun:
    booleanEnv(
      "DRY_RUN",
      true,
    ),

  supabaseFunctionUrl:
    requiredEnv(
      "SUPABASE_FUNCTION_URL",
    ),

  driveWorkerSecret:
    requiredEnv(
      "DRIVE_WORKER_SECRET",
    ),

  truenasWsUrl:
    requiredEnv(
      "TRUENAS_WS_URL",
    ),

  truenasApiKey:
    requiredEnv(
      "TRUENAS_API_KEY",
    ),

  truenasRejectUnauthorized:
    booleanEnv(
      "TRUENAS_REJECT_UNAUTHORIZED",
      true,
    ),

  truenasParentDataset:
    requiredEnv(
      "TRUENAS_PARENT_DATASET",
    ),

  truenasParentMount:
    requiredEnv(
      "TRUENAS_PARENT_MOUNT",
    ),

  truenasNextcloudUid:
    integerEnv(
      "TRUENAS_NEXTCLOUD_UID",
      33,
    ),

  driveQuotaBytes:
    integerEnv(
      "DRIVE_QUOTA_BYTES",
      108447924224,
    ),

  truenasNextcloudAppName:
    requiredEnv(
      "TRUENAS_NEXTCLOUD_APP_NAME",
    ),

  nextcloudReadyTimeoutMs:
    integerEnv(
      "NEXTCLOUD_READY_TIMEOUT_MS",
      180000,
    ),

  nextcloudUrl:
    requiredEnv(
      "NEXTCLOUD_URL",
    ).replace(/\/+$/, ""),

  nextcloudWorkerUsername:
    requiredEnv(
      "NEXTCLOUD_WORKER_USERNAME",
    ),

  nextcloudWorkerAppPassword:
    requiredEnv(
      "NEXTCLOUD_WORKER_APP_PASSWORD",
    ),

  nextcloudPartnerGroup:
    requiredEnv(
      "NEXTCLOUD_PARTNER_GROUP",
    ),

  resendApiKey:
    requiredEnv(
      "RESEND_API_KEY",
    ),

  driveEmailFrom:
    requiredEnv(
      "DRIVE_EMAIL_FROM",
    ),

  drivePortalUrl:
    requiredEnv(
      "DRIVE_PORTAL_URL",
    ),
};

// --------------------------------------------------
// GENERAL UTILITIES
// --------------------------------------------------

function sleep(milliseconds) {
  return new Promise(
    (resolve) => {
      setTimeout(
        resolve,
        milliseconds,
      );
    },
  );
}

function errorMessage(error) {
  if (
    error instanceof Error
  ) {
    return error.message;
  }

  return String(error);
}

function escapeHtml(value) {
  return String(value)
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

function generateTemporaryPassword() {
  const random =
    crypto
      .randomBytes(24)
      .toString("base64url");

  return `MsD!${random}9a`;
}

function validateUsername(
  value,
) {
  return (
    typeof value ===
      "string" &&
    /^[a-z0-9._]{3,30}$/.test(
      value,
    )
  );
}

function validateDataset(
  datasetName,
  username,
) {
  const expected =
    `meetshawon_${username}`;

  if (
    datasetName !==
    expected
  ) {
    throw new Error(
      `Unsafe dataset name: expected ${expected}`,
    );
  }

  return {
    datasetId:
      `${config.truenasParentDataset}/${datasetName}`,

    mountPath:
      `${config.truenasParentMount}/${datasetName}`,
  };
}

function getDisplayName(
  user,
  username,
) {
  const direct =
    user?.display_name
      ?.trim();

  if (direct) {
    return direct;
  }

  const combined = [
    user?.first_name,
    user?.last_name,
  ]
    .filter(Boolean)
    .join(" ")
    .trim();

  return (
    combined ||
    username
  );
}

// --------------------------------------------------
// SUPABASE WORKER GATEWAY
// --------------------------------------------------

async function workerGateway(
  action,
  payload = {},
) {
  const response =
    await fetch(
      config.supabaseFunctionUrl,
      {
        method:
          "POST",

        headers: {
          authorization:
            `Bearer ${config.driveWorkerSecret}`,

          "content-type":
            "application/json",
        },

        body:
          JSON.stringify({
            action,
            worker_name:
              config.workerName,
            ...payload,
          }),
      },
    );

  let body;

  try {
    body =
      await response.json();
  } catch {
    throw new Error(
      `Worker gateway returned invalid JSON (${response.status}).`,
    );
  }

  if (!response.ok) {
    throw new Error(
      body?.error ||
      `Worker gateway failed (${response.status}).`,
    );
  }

  return body;
}

// --------------------------------------------------
// TRUENAS JSON-RPC CLIENT
// --------------------------------------------------

class TrueNasClient {
  constructor() {
    this.socket = null;
    this.nextId = 1;
    this.pending =
      new Map();
  }

  async connect() {
    if (
      this.socket?.readyState ===
      WebSocket.OPEN
    ) {
      return;
    }

    this.socket =
      new WebSocket(
        config.truenasWsUrl,
        {
          rejectUnauthorized:
            config
              .truenasRejectUnauthorized,
        },
      );

    this.socket.on(
      "message",
      (raw) => {
        let message;

        try {
          message =
            JSON.parse(
              raw.toString(),
            );
        } catch {
          return;
        }

        if (
          message.id ===
          undefined
        ) {
          return;
        }

        const pending =
          this.pending.get(
            message.id,
          );

        if (!pending) {
          return;
        }

        this.pending.delete(
          message.id,
        );

        clearTimeout(
          pending.timer,
        );

        if (message.error) {
          pending.reject(
            new Error(
              message.error
                .message ||
              JSON.stringify(
                message.error,
              ),
            ),
          );

          return;
        }

        pending.resolve(
          message.result,
        );
      },
    );

    this.socket.on(
      "close",
      () => {
        for (
          const pending
          of this.pending.values()
        ) {
          clearTimeout(
            pending.timer,
          );

          pending.reject(
            new Error(
              "TrueNAS WebSocket closed.",
            ),
          );
        }

        this.pending.clear();
      },
    );

    await new Promise(
      (
        resolve,
        reject,
      ) => {
        const timer =
          setTimeout(
            () => {
              reject(
                new Error(
                  "TrueNAS connection timed out.",
                ),
              );
            },
            15000,
          );

        this.socket.once(
          "open",
          () => {
            clearTimeout(
              timer,
            );

            resolve();
          },
        );

        this.socket.once(
          "error",
          (error) => {
            clearTimeout(
              timer,
            );

            reject(
              error,
            );
          },
        );
      },
    );

    const authenticated =
      await this.call(
        "auth.login_with_api_key",
        [
          config.truenasApiKey,
        ],
      );

    if (
      authenticated !==
      true
    ) {
      throw new Error(
        "TrueNAS API authentication failed.",
      );
    }
  }

  call(
    method,
    params = [],
    timeoutMs = 30000,
  ) {
    if (
      !this.socket ||
      this.socket.readyState !==
        WebSocket.OPEN
    ) {
      throw new Error(
        "TrueNAS WebSocket is not connected.",
      );
    }

    const id =
      this.nextId;

    this.nextId += 1;

    return new Promise(
      (
        resolve,
        reject,
      ) => {
        const timer =
          setTimeout(
            () => {
              this.pending.delete(
                id,
              );

              reject(
                new Error(
                  `TrueNAS method timed out: ${method}`,
                ),
              );
            },
            timeoutMs,
          );

        this.pending.set(
          id,
          {
            resolve,
            reject,
            timer,
          },
        );

        this.socket.send(
          JSON.stringify({
            jsonrpc:
              "2.0",
            id,
            method,
            params,
          }),
        );
      },
    );
  }

  async waitForJob(
    jobId,
  ) {
    if (
      !Number.isSafeInteger(
        jobId,
      )
    ) {
      throw new Error(
        "TrueNAS did not return a valid job ID.",
      );
    }

    const deadline =
      Date.now() +
      120000;

    while (
      Date.now() <
      deadline
    ) {
      const jobs =
        await this.call(
          "core.get_jobs",
          [
            [
              [
                "id",
                "=",
                jobId,
              ],
            ],
          ],
        );

      const job =
        Array.isArray(
          jobs,
        )
          ? jobs[0]
          : jobs;

      if (!job) {
        await sleep(
          500,
        );

        continue;
      }

      if (
        job.state ===
        "SUCCESS"
      ) {
        return job.result;
      }

      if (
        job.state ===
          "FAILED" ||
        job.state ===
          "ABORTED"
      ) {
        throw new Error(
          job.error ||
          job.exception ||
          `TrueNAS job ${jobId} ${job.state.toLowerCase()}.`,
        );
      }

      await sleep(
        500,
      );
    }

    throw new Error(
      `TrueNAS job ${jobId} timed out.`,
    );
  }

  close() {
    if (
      this.socket &&
      (
        this.socket.readyState ===
          WebSocket.OPEN ||
        this.socket.readyState ===
          WebSocket.CONNECTING
      )
    ) {
      this.socket.close();
    }
  }
}

// --------------------------------------------------
// TRUENAS DATASET PROVISIONING
// --------------------------------------------------

async function datasetExists(
  truenas,
  datasetId,
) {
  const result =
    await truenas.call(
      "pool.dataset.query",
      [
        [
          [
            "id",
            "=",
            datasetId,
          ],
        ],
      ],
    );

  return (
    Array.isArray(
      result,
    ) &&
    result.length > 0
  );
}

async function ensureDataset(
  truenas,
  datasetId,
  username,
) {
  const exists =
    await datasetExists(
      truenas,
      datasetId,
    );

  if (!exists) {
    await truenas.call(
      "pool.dataset.create",
      [
        {
          name:
            datasetId,

          type:
            "FILESYSTEM",

          quota:
            config
              .driveQuotaBytes,

          comments:
            `Meet Shawon Drive storage for ${username}`,

          acltype:
            "POSIX",

          atime:
            "OFF",

          compression:
            "INHERIT",

          inherit_encryption:
            true,

          managedby:
            "meetshawon-drive-worker",
        },
      ],
      60000,
    );

    return {
      created: true,
    };
  } else {
    await truenas.call(
      "pool.dataset.update",
      [
        datasetId,
        {
          quota:
            config
              .driveQuotaBytes,

          managedby:
            "meetshawon-drive-worker",
        },
      ],
      60000,
    );
  }

  return {
    created: false,
  };
}

function permissions(
  read,
  write,
  execute,
) {
  return {
    READ:
      read,
    WRITE:
      write,
    EXECUTE:
      execute,
  };
}

async function applyDatasetAcl(
  truenas,
  mountPath,
) {
  const ownerPermissions =
    permissions(
      true,
      true,
      true,
    );

  const groupPermissions =
    permissions(
      true,
      false,
      true,
    );

  const noPermissions =
    permissions(
      false,
      false,
      false,
    );

  const maskPermissions =
    permissions(
      true,
      true,
      true,
    );

  const nextcloudPermissions =
    permissions(
      true,
      true,
      true,
    );

  const accessAcl = [
    {
      tag:
        "USER_OBJ",
      id:
        null,
      perms:
        ownerPermissions,
      default:
        false,
    },
    {
      tag:
        "GROUP_OBJ",
      id:
        null,
      perms:
        groupPermissions,
      default:
        false,
    },
    {
      tag:
        "OTHER",
      id:
        null,
      perms:
        noPermissions,
      default:
        false,
    },
    {
      tag:
        "MASK",
      id:
        null,
      perms:
        maskPermissions,
      default:
        false,
    },
    {
      tag:
        "USER",
      id:
        config
          .truenasNextcloudUid,
      perms:
        nextcloudPermissions,
      default:
        false,
    },
  ];

  const defaultAcl =
    accessAcl.map(
      (entry) => ({
        ...entry,
        default:
          true,
      }),
    );

  const jobId =
    await truenas.call(
      "filesystem.setacl",
      [
        {
          path:
            mountPath,

          acltype:
            "POSIX1E",

          dacl: [
            ...accessAcl,
            ...defaultAcl,
          ],

          options: {
            stripacl:
              false,
            recursive:
              false,
            traverse:
              false,
            canonicalize:
              true,
            validate_effective_acl:
              true,
          },
        },
      ],
      60000,
    );

  await truenas.waitForJob(
    jobId,
  );
}

async function redeployNextcloud(
  truenas,
) {
  console.log(
    `[drive-worker] Redeploying TrueNAS app ${config.truenasNextcloudAppName} to refresh dataset mounts`,
  );

  const jobId =
    await truenas.call(
      "app.redeploy",
      [
        config
          .truenasNextcloudAppName,
      ],
      60000,
    );

  await truenas.waitForJob(
    jobId,
  );

  console.log(
    "[drive-worker] TrueNAS accepted the Nextcloud redeployment",
  );
}

// --------------------------------------------------
// NEXTCLOUD OCS CLIENT
// --------------------------------------------------

async function nextcloudRequest(
  path,
  {
    method = "GET",
    form,
    allowNotFound = false,
  } = {},
) {
  const authorization =
    Buffer.from(
      `${config.nextcloudWorkerUsername}:${config.nextcloudWorkerAppPassword}`,
    ).toString(
      "base64",
    );

  const response =
    await fetch(
      `${config.nextcloudUrl}${path}`,
      {
        method,

        headers: {
          authorization:
            `Basic ${authorization}`,

          "OCS-APIRequest":
            "true",

          accept:
            "application/json",

          ...(form
            ? {
                "content-type":
                  "application/x-www-form-urlencoded",
              }
            : {}),
        },

        body:
          form
            ? new URLSearchParams(
                form,
              )
            : undefined,
      },
    );

  let body;

  try {
    body =
      await response.json();
  } catch {
    throw new Error(
      `Nextcloud returned invalid JSON (${response.status}).`,
    );
  }

  const meta =
    body?.ocs?.meta;

  const statusCode =
    Number(
      meta?.statuscode ??
      response.status,
    );

  if (
    allowNotFound &&
    (
      response.status ===
        404 ||
      statusCode === 404
    )
  ) {
    return null;
  }

  if (
    !response.ok ||
    meta?.status ===
      "failure"
  ) {
    throw new Error(
      meta?.message ||
      `Nextcloud request failed (${statusCode}).`,
    );
  }

  return body?.ocs?.data;
}

async function waitForNextcloudReady() {
  const deadline =
    Date.now() +
    config
      .nextcloudReadyTimeoutMs;

  let lastError =
    "Nextcloud is not ready.";

  while (
    Date.now() <
    deadline
  ) {
    try {
      await getNextcloudUser(
        config
          .nextcloudWorkerUsername,
      );

      console.log(
        "[drive-worker] Nextcloud is ready after redeploy",
      );

      return;
    } catch (error) {
      lastError =
        errorMessage(
          error,
        );

      await sleep(
        3000,
      );
    }
  }

  throw new Error(
    `Nextcloud did not become ready within ${config.nextcloudReadyTimeoutMs}ms: ${lastError}`,
  );
}

async function getNextcloudUser(
  username,
) {
  return nextcloudRequest(
    `/ocs/v1.php/cloud/users/${encodeURIComponent(username)}?format=json`,
    {
      allowNotFound:
        true,
    },
  );
}

async function createNextcloudUser({
  username,
  password,
  displayName,
  email,
}) {
  await nextcloudRequest(
    "/ocs/v1.php/cloud/users?format=json",
    {
      method:
        "POST",

      form: {
        userid:
          username,
        password,
        displayName,
        email,
        quota:
          String(
            config
              .driveQuotaBytes,
          ),
      },
    },
  );
}

async function updateNextcloudUser(
  username,
  key,
  value,
) {
  await nextcloudRequest(
    `/ocs/v1.php/cloud/users/${encodeURIComponent(username)}?format=json`,
    {
      method:
        "PUT",

      form: {
        key,
        value:
          String(value),
      },
    },
  );
}

async function addNextcloudUserToPartnerGroup(
  username,
) {
  await nextcloudRequest(
    `/ocs/v1.php/cloud/users/${encodeURIComponent(username)}/groups?format=json`,
    {
      method:
        "POST",

      form: {
        groupid:
          config
            .nextcloudPartnerGroup,
      },
    },
  );
}

async function enableNextcloudUser(
  username,
) {
  await nextcloudRequest(
    `/ocs/v1.php/cloud/users/${encodeURIComponent(username)}/enable?format=json`,
    {
      method:
        "PUT",
    },
  );
}

async function disableNextcloudUser(
  username,
) {
  await nextcloudRequest(
    `/ocs/v1.php/cloud/users/${encodeURIComponent(username)}/disable?format=json`,
    {
      method:
        "PUT",
    },
  );
}

async function ensureNextcloudUser({
  username,
  displayName,
  email,
}) {
  const existing =
    await getNextcloudUser(
      username,
    );

  let temporaryPassword =
    null;

  if (!existing) {
    temporaryPassword =
      generateTemporaryPassword();

    await createNextcloudUser({
      username,
      password:
        temporaryPassword,
      displayName,
      email,
    });
  } else {
    await enableNextcloudUser(
      username,
    );

    await updateNextcloudUser(
      username,
      "displayname",
      displayName,
    );

    if (email) {
      await updateNextcloudUser(
        username,
        "email",
        email,
      );
    }

    await updateNextcloudUser(
      username,
      "quota",
      config
        .driveQuotaBytes,
    );
  }

  await addNextcloudUserToPartnerGroup(
    username,
  );

  return {
    created:
      !existing,
    temporaryPassword,
  };
}

// --------------------------------------------------
// EMAIL
// --------------------------------------------------

async function sendEmail({
  to,
  subject,
  html,
}) {
  if (!to) {
    throw new Error(
      "The user has no email address.",
    );
  }

  const response =
    await fetch(
      "https://api.resend.com/emails",
      {
        method:
          "POST",

        headers: {
          authorization:
            `Bearer ${config.resendApiKey}`,

          "content-type":
            "application/json",
        },

        body:
          JSON.stringify({
            from:
              config
                .driveEmailFrom,
            to: [
              to,
            ],
            subject,
            html,
          }),
      },
    );

  if (!response.ok) {
    const message =
      await response.text();

    throw new Error(
      `Email delivery failed: ${message.slice(0, 500)}`,
    );
  }
}

async function sendProvisionedEmail({
  email,
  displayName,
  username,
  temporaryPassword,
}) {
  const passwordSection =
    temporaryPassword
      ? `
        <p>Your temporary Nextcloud password is:</p>
        <p style="font-family:monospace;font-size:18px">
          <strong>${escapeHtml(temporaryPassword)}</strong>
        </p>
        <p>
          Change this password immediately after your first sign-in.
          It is separate from your MeetShawon.com website password.
        </p>
      `
      : `
        <p>
          Your existing Nextcloud password remains unchanged.
        </p>
      `;

  await sendEmail({
    to:
      email,

    subject:
      "Your Meet Shawon Drive is ready",

    html: `
      <h2>Meet Shawon Drive</h2>

      <p>Hello ${escapeHtml(displayName)},</p>

      <p>
        Your private Partner storage has been provisioned successfully.
        Your storage allowance is 101 GiB.
      </p>

      <p>
        <strong>Username:</strong>
        ${escapeHtml(username)}
      </p>

      ${passwordSection}

      <p>
        <a href="${escapeHtml(config.drivePortalUrl)}">
          Open Meet Shawon Drive
        </a>
      </p>

      <p>
        Your files remain private unless you explicitly create a share.
      </p>
    `,
  });
}

async function sendSuspendedEmail({
  email,
  displayName,
}) {
  await sendEmail({
    to:
      email,

    subject:
      "Your Meet Shawon Drive access has been disabled",

    html: `
      <h2>Meet Shawon Drive</h2>

      <p>Hello ${escapeHtml(displayName)},</p>

      <p>
        Your Partner Drive access has been disabled.
        Your stored data has not been deleted.
      </p>

      <p>
        The retained data is scheduled for review after 30 days.
        If you need to recover important files or believe this was
        unexpected, please contact Md Samsudduha Shawon immediately.
      </p>

      <p>
        Dataset deletion requires a manual administrator review.
      </p>
    `,
  });
}

// --------------------------------------------------
// JOB HANDLERS
// --------------------------------------------------

async function provisionAccount(
  claim,
) {
  const {
    job,
    account,
    user,
  } = claim;

  const username =
    account
      ?.nextcloud_username;

  const datasetName =
    account
      ?.dataset_name;

  if (
    !validateUsername(
      username,
    )
  ) {
    throw new Error(
      "The claimed account has an invalid Nextcloud username.",
    );
  }

  const {
    datasetId,
    mountPath,
  } =
    validateDataset(
      datasetName,
      username,
    );

  const displayName =
    getDisplayName(
      user,
      username,
    );

  const truenas =
    new TrueNasClient();

  let datasetCreated =
    false;

  try {
    await truenas.connect();

    const dataset =
      await ensureDataset(
        truenas,
        datasetId,
        username,
      );

    datasetCreated =
      dataset.created;

    await applyDatasetAcl(
      truenas,
      mountPath,
    );

    await redeployNextcloud(
      truenas,
    );

  } finally {
    truenas.close();
  }

  await waitForNextcloudReady();

  const nextcloud =
    await ensureNextcloudUser({
      username,
      displayName,
      email:
        user?.email,
    });

  await sendProvisionedEmail({
    email:
      user?.email,
    displayName,
    username,
    temporaryPassword:
      nextcloud
        .temporaryPassword,
  });

  return {
    action:
      job.action,
    username,
    dataset_name:
      datasetName,
    dataset_id:
      datasetId,
    mount_path:
      mountPath,
    quota_bytes:
      config
        .driveQuotaBytes,
    dataset_created:
      datasetCreated,
    nextcloud_redeployed:
      true,
    nextcloud_user_created:
      nextcloud.created,
    notification_sent:
      true,
  };
}

async function suspendAccount(
  claim,
) {
  const {
    job,
    account,
    user,
  } = claim;

  const username =
    account
      ?.nextcloud_username;

  if (
    !validateUsername(
      username,
    )
  ) {
    throw new Error(
      "The claimed account has an invalid Nextcloud username.",
    );
  }

  const existing =
    await getNextcloudUser(
      username,
    );

  if (existing) {
    await disableNextcloudUser(
      username,
    );
  }

  const displayName =
    getDisplayName(
      user,
      username,
    );

  await sendSuspendedEmail({
    email:
      user?.email,
    displayName,
  });

  return {
    action:
      job.action,
    username,
    nextcloud_user_disabled:
      Boolean(existing),
    dataset_preserved:
      true,
    manual_deletion_required:
      true,
    notification_sent:
      true,
  };
}

async function processClaim(
  claim,
) {
  const action =
    claim?.job?.action;

  if (
    action ===
    "provision"
  ) {
    return provisionAccount(
      claim,
    );
  }

  if (
    action ===
    "suspend"
  ) {
    return suspendAccount(
      claim,
    );
  }

  throw new Error(
    `Unsupported job action: ${String(action)}`,
  );
}

// --------------------------------------------------
// WORKER LOOP
// --------------------------------------------------

let stopping = false;

process.on(
  "SIGTERM",
  () => {
    stopping =
      true;
  },
);

process.on(
  "SIGINT",
  () => {
    stopping =
      true;
  },
);

async function run() {
  console.log(
    `[drive-worker] Starting ${config.workerName}`,
  );

  if (config.dryRun) {
    console.log(
      "[drive-worker] DRY_RUN=true â€” queue claims are disabled.",
    );
  }

  while (!stopping) {
    try {
      if (config.dryRun) {
        await sleep(
          config
            .pollIntervalMs,
        );

        continue;
      }

      const claim =
        await workerGateway(
          "claim",
        );

      if (!claim.job) {
        await sleep(
          config
            .pollIntervalMs,
        );

        continue;
      }

      const jobId =
        Number(
          claim.job.id,
        );

      if (
        !Number.isSafeInteger(
          jobId,
        ) ||
        jobId <= 0
      ) {
        throw new Error(
          "The gateway returned an invalid job ID.",
        );
      }

      console.log(
        `[drive-worker] Claimed job ${jobId}: ${claim.job.action}`,
      );

      try {
        const result =
          await processClaim(
            claim,
          );

        await workerGateway(
          "complete",
          {
            job_id:
              jobId,
            result,
          },
        );

        console.log(
          `[drive-worker] Completed job ${jobId}`,
        );
      } catch (error) {
        const message =
          errorMessage(
            error,
          );

        console.error(
          `[drive-worker] Job ${jobId} failed: ${message}`,
        );

        await workerGateway(
          "fail",
          {
            job_id:
              jobId,
            error:
              message,
            retry_after_seconds:
              300,
          },
        );
      }
    } catch (error) {
      console.error(
        `[drive-worker] Loop error: ${errorMessage(error)}`,
      );

      await sleep(
        config
          .pollIntervalMs,
      );
    }
  }

  console.log(
    "[drive-worker] Stopped.",
  );
}

run().catch(
  (error) => {
    console.error(
      `[drive-worker] Fatal error: ${errorMessage(error)}`,
    );

    process.exitCode =
      1;
  },
);