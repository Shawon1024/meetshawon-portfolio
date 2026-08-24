"use client";

import {
  AlertTriangle,
  CalendarClock,
  CircleCheckBig,
  HardDrive,
  RotateCcw,
  ShieldAlert,
  Trash2,
  X,
} from "lucide-react";
import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { createClient } from "../../lib/supabase/client";

export interface DriveAccountReview {
  user_id: string;
  first_name: string | null;
  last_name: string | null;
  avatar_url: string | null;
  website_username: string;
  dataset_name: string;
  nextcloud_username: string;
  quota_bytes: number | string;
  lifecycle_status: string;
  deletion_scheduled_at: string | null;
  provisioned_at: string | null;
  suspended_at: string | null;
  deleted_at: string | null;
  last_error: string | null;
  created_at: string;
  updated_at: string;
}

interface DriveRetentionManagerProps {
  initialAccounts: DriveAccountReview[];
  serverNow: string;
}

const dateFormatter = new Intl.DateTimeFormat("en-GB", {
  dateStyle: "medium",
  timeStyle: "short",
  timeZone: "Europe/London",
});

function formatDate(value: string | null) {
  if (!value) {
    return "Not set";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "Unknown";
  }

  return dateFormatter.format(date);
}

function formatQuota(value: number | string) {
  const bytes = Number(value);

  if (!Number.isFinite(bytes) || bytes <= 0) {
    return "Unknown";
  }

  return `${(bytes / 1024 ** 3).toFixed(0)} GiB`;
}

function statusStyles(status: string) {
  switch (status) {
    case "suspension_pending":
      return "border-amber-400/20 bg-amber-400/10 text-amber-300";
    case "suspended":
      return "border-orange-400/20 bg-orange-400/10 text-orange-300";
    case "deletion_due":
      return "border-red-400/20 bg-red-400/10 text-red-300";
    case "deleted":
      return "border-gray-400/20 bg-gray-400/10 text-gray-300";
    case "error":
      return "border-rose-400/20 bg-rose-400/10 text-rose-300";
    default:
      return "border-blue-400/20 bg-blue-400/10 text-blue-300";
  }
}

function readableStatus(status: string) {
  return status
    .split("_")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

export default function DriveRetentionManager({
  initialAccounts,
  serverNow,
}: DriveRetentionManagerProps) {
  const router = useRouter();
  const referenceTime = Date.parse(serverNow);

  const [accounts, setAccounts] =
    useState<DriveAccountReview[]>(initialAccounts);
  const [approvalAccount, setApprovalAccount] =
    useState<DriveAccountReview | null>(null);
  const [cancelAccount, setCancelAccount] =
    useState<DriveAccountReview | null>(null);
  const [confirmation, setConfirmation] = useState("");
  const [workingUserId, setWorkingUserId] =
    useState<string | null>(null);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  const reviewAccounts = useMemo(
    () =>
      accounts.filter(
        (account) =>
          account.lifecycle_status !== "active" &&
          account.lifecycle_status !== "provisioning" &&
          account.lifecycle_status !== "deleted",
      ),
    [accounts],
  );

  const stats = useMemo(() => {
    const isPastDeadline = (account: DriveAccountReview) => {
      if (!account.deletion_scheduled_at) {
        return false;
      }

      const deadline = Date.parse(account.deletion_scheduled_at);

      return Number.isFinite(deadline) && deadline <= referenceTime;
    };

    return {
      suspended: accounts.filter(
        (account) => account.lifecycle_status === "suspended",
      ).length,
      scheduled: accounts.filter(
        (account) =>
          Boolean(account.deletion_scheduled_at) &&
          account.lifecycle_status !== "deleted",
      ).length,
      due: accounts.filter(
        (account) =>
          isPastDeadline(account) &&
          ["suspended", "deletion_due"].includes(
            account.lifecycle_status,
          ),
      ).length,
      errors: accounts.filter(
        (account) => account.lifecycle_status === "error",
      ).length,
    };
  }, [accounts, referenceTime]);

  const deletionIsDue = (account: DriveAccountReview) => {
    if (!account.deletion_scheduled_at) {
      return false;
    }

    const deadline = Date.parse(account.deletion_scheduled_at);

    return (
      Number.isFinite(deadline) &&
      deadline <= referenceTime &&
      ["suspended", "deletion_due"].includes(
        account.lifecycle_status,
      )
    );
  };

  const closeApproval = () => {
    if (workingUserId) {
      return;
    }

    setApprovalAccount(null);
    setConfirmation("");
  };

  const approveDeletion = async () => {
    if (
      !approvalAccount ||
      confirmation !== approvalAccount.website_username
    ) {
      return;
    }

    try {
      setWorkingUserId(approvalAccount.user_id);
      setError("");
      setNotice("");

      const supabase = createClient();
      const { error: approvalError } = await supabase.rpc(
        "admin_approve_drive_deletion",
        {
          target_user_id: approvalAccount.user_id,
        },
      );

      if (approvalError) {
        throw approvalError;
      }

      setAccounts((current) =>
        current.map((account) =>
          account.user_id === approvalAccount.user_id
            ? {
                ...account,
                lifecycle_status: "deletion_due",
              }
            : account,
        ),
      );

      setNotice(
        `Permanent deletion was approved for @${approvalAccount.website_username}. The Drive worker will process the guarded deletion job.`,
      );
      setApprovalAccount(null);
      setConfirmation("");
      router.refresh();
    } catch (caughtError) {
      setError(
        caughtError instanceof Error
          ? caughtError.message
          : "Drive deletion could not be approved.",
      );
    } finally {
      setWorkingUserId(null);
    }
  };

  const cancelDeletion = async () => {
    if (!cancelAccount) {
      return;
    }

    try {
      setWorkingUserId(cancelAccount.user_id);
      setError("");
      setNotice("");

      const supabase = createClient();
      const { error: cancellationError } = await supabase.rpc(
        "admin_cancel_drive_deletion",
        {
          target_user_id: cancelAccount.user_id,
        },
      );

      if (cancellationError) {
        throw cancellationError;
      }

      setAccounts((current) =>
        current.map((account) =>
          account.user_id === cancelAccount.user_id
            ? {
                ...account,
                lifecycle_status: "suspended",
                deletion_scheduled_at: null,
              }
            : account,
        ),
      );

      setNotice(
        `Scheduled deletion was cancelled for @${cancelAccount.website_username}. The data remains suspended and preserved.`,
      );
      setCancelAccount(null);
      router.refresh();
    } catch (caughtError) {
      setError(
        caughtError instanceof Error
          ? caughtError.message
          : "Scheduled Drive deletion could not be cancelled.",
      );
    } finally {
      setWorkingUserId(null);
    }
  };

  return (
    <>
      <div className="overflow-hidden rounded-3xl border border-white/10 bg-white/[0.025] shadow-2xl shadow-black/10">
        <div className="border-b border-white/10 p-6 md:p-8">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-cyan-400/20 bg-cyan-400/10 text-cyan-300">
                <HardDrive size={23} />
              </div>

              <div>
                <p className="text-sm font-medium uppercase tracking-[0.2em] text-cyan-300">
                  Drive retention
                </p>
                <h2 className="mt-2 text-2xl font-bold text-white">
                  Suspended storage review
                </h2>
                <p className="mt-3 max-w-2xl leading-7 text-gray-400">
                  Review suspended Drive accounts, preserve data during the
                  30-day grace period, and explicitly approve permanent
                  deletion only after the deadline.
                </p>
              </div>
            </div>

            <div className="inline-flex items-center gap-2 rounded-xl border border-amber-400/20 bg-amber-400/[0.07] px-4 py-3 text-sm text-amber-200">
              <ShieldAlert size={17} className="shrink-0" />
              No dataset is deleted automatically
            </div>
          </div>

          <div className="mt-7 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
            {[
              ["Suspended", stats.suspended, HardDrive, "text-orange-300"],
              ["Scheduled", stats.scheduled, CalendarClock, "text-amber-300"],
              ["Ready for review", stats.due, Trash2, "text-red-300"],
              ["Attention needed", stats.errors, AlertTriangle, "text-rose-300"],
            ].map(([label, value, Icon, colour]) => {
              const StatIcon = Icon as typeof HardDrive;

              return (
                <div
                  key={String(label)}
                  className="rounded-2xl border border-white/10 bg-black/10 p-4"
                >
                  <div className="flex items-center justify-between gap-3">
                    <p className="text-sm text-gray-400">{String(label)}</p>
                    <StatIcon size={17} className={String(colour)} />
                  </div>
                  <p className="mt-3 text-2xl font-bold text-white">
                    {String(value)}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        <div className="p-6 md:p-8">
          {error && (
            <div className="mb-5 flex items-start gap-3 rounded-2xl border border-red-400/20 bg-red-400/10 p-4 text-sm text-red-200">
              <AlertTriangle size={18} className="mt-0.5 shrink-0" />
              <p>{error}</p>
            </div>
          )}

          {notice && (
            <div className="mb-5 flex items-start gap-3 rounded-2xl border border-green-400/20 bg-green-400/10 p-4 text-sm text-green-200">
              <CircleCheckBig size={18} className="mt-0.5 shrink-0" />
              <p>{notice}</p>
            </div>
          )}

          {reviewAccounts.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-white/10 p-8 text-center">
              <CircleCheckBig className="mx-auto text-green-300" size={28} />
              <p className="mt-4 font-medium text-white">
                No Drive accounts require review
              </p>
              <p className="mt-2 text-sm text-gray-500">
                Suspended accounts and retention deadlines will appear here.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {reviewAccounts.map((account) => {
                const fullName =
                  [
                    account.first_name?.trim(),
                    account.last_name?.trim(),
                  ]
                    .filter(Boolean)
                    .join(" ") ||
                  "Name unavailable";

                const avatarInitial =
                  (
                    account.first_name?.charAt(0) ||
                    account.last_name?.charAt(0) ||
                    account.website_username?.charAt(0) ||
                    "?"
                  ).toUpperCase();
                const isWorking = workingUserId === account.user_id;
                const isDeleted = account.lifecycle_status === "deleted";
                const due = deletionIsDue(account);

                return (
                  <article
                    key={account.user_id}
                    className="rounded-2xl border border-white/10 bg-black/10 p-5 md:p-6"
                  >
                    <div className="flex flex-col gap-5 xl:flex-row xl:items-start xl:justify-between">
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-4">
                          {account.avatar_url ? (
                            <Image
                              src={account.avatar_url}
                              alt=""
                              width={52}
                              height={52}
                              sizes="52px"
                              className="h-[52px] w-[52px] shrink-0 rounded-full border border-white/10 object-cover"
                            />
                          ) : (
                            <div className="flex h-[52px] w-[52px] shrink-0 items-center justify-center rounded-full border border-white/10 bg-green-400/10 font-semibold text-green-300">
                              {avatarInitial}
                            </div>
                          )}

                          <div className="min-w-0">
                            <div className="flex flex-wrap items-center gap-3">
                              <h3 className="truncate text-lg font-semibold text-white">
                                {fullName}
                              </h3>

                              <span
                                className={`rounded-full border px-3 py-1 text-xs font-medium ${statusStyles(
                                  account.lifecycle_status,
                                )}`}
                              >
                                {readableStatus(account.lifecycle_status)}
                              </span>
                            </div>

                            <p className="mt-1 truncate text-sm text-gray-500">
                              @{account.website_username}
                            </p>
                          </div>
                        </div>

                        <div className="mt-4 grid gap-3 text-sm sm:grid-cols-2 lg:grid-cols-4">
                          <div>
                            <p className="text-gray-500">Nextcloud account</p>
                            <p className="mt-1 break-all text-gray-300">
                              {account.nextcloud_username}
                            </p>
                          </div>
                          <div>
                            <p className="text-gray-500">Dataset</p>
                            <p className="mt-1 break-all text-gray-300">
                              {account.dataset_name}
                            </p>
                          </div>
                          <div>
                            <p className="text-gray-500">Quota</p>
                            <p className="mt-1 text-gray-300">
                              {formatQuota(account.quota_bytes)}
                            </p>
                          </div>
                          <div>
                            <p className="text-gray-500">Suspended</p>
                            <p className="mt-1 text-gray-300">
                              {formatDate(account.suspended_at)}
                            </p>
                          </div>
                        </div>

                        <div
                          className={`mt-4 flex items-start gap-3 rounded-xl border p-4 text-sm ${
                            due
                              ? "border-red-400/20 bg-red-400/[0.07] text-red-200"
                              : "border-amber-400/15 bg-amber-400/[0.05] text-amber-100"
                          }`}
                        >
                          <CalendarClock size={17} className="mt-0.5 shrink-0" />
                          <div>
                            <p className="font-medium">
                              {due
                                ? "Retention deadline has passed"
                                : "Retention deadline"}
                            </p>
                            <p className="mt-1 text-xs opacity-75">
                              {formatDate(account.deletion_scheduled_at)}
                            </p>
                          </div>
                        </div>

                        {account.last_error && (
                          <div className="mt-4 flex items-start gap-3 rounded-xl border border-rose-400/20 bg-rose-400/[0.07] p-4 text-sm text-rose-200">
                            <AlertTriangle
                              size={17}
                              className="mt-0.5 shrink-0"
                            />
                            <p className="break-words">{account.last_error}</p>
                          </div>
                        )}
                      </div>

                      {!isDeleted && (
                        <div className="flex shrink-0 flex-wrap gap-3">
                          {account.deletion_scheduled_at && (
                            <button
                              type="button"
                              disabled={isWorking}
                              onClick={() => setCancelAccount(account)}
                              className="inline-flex items-center gap-2 rounded-xl border border-blue-400/20 bg-blue-400/10 px-4 py-2.5 text-sm font-medium text-blue-200 transition hover:border-blue-400/40 hover:bg-blue-400/15 disabled:cursor-not-allowed disabled:opacity-50"
                            >
                              <RotateCcw size={16} />
                              Cancel deletion
                            </button>
                          )}

                          <button
                            type="button"
                            disabled={!due || isWorking}
                            onClick={() => {
                              setApprovalAccount(account);
                              setConfirmation("");
                            }}
                            className="inline-flex items-center gap-2 rounded-xl border border-red-400/20 bg-red-400/10 px-4 py-2.5 text-sm font-medium text-red-200 transition hover:border-red-400/40 hover:bg-red-400/15 disabled:cursor-not-allowed disabled:opacity-40"
                            title={
                              due
                                ? "Review permanent deletion"
                                : "Available only after the retention deadline"
                            }
                          >
                            <Trash2 size={16} />
                            Review deletion
                          </button>
                        </div>
                      )}
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {approvalAccount && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/75 p-4 backdrop-blur-sm">
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="drive-delete-title"
            className="w-full max-w-lg rounded-3xl border border-red-400/20 bg-[#071b1a] p-6 shadow-2xl md:p-8"
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-red-400/10 text-red-300">
                <Trash2 size={22} />
              </div>
              <button
                type="button"
                onClick={closeApproval}
                className="rounded-lg p-2 text-gray-500 transition hover:bg-white/5 hover:text-white"
                aria-label="Close deletion review"
              >
                <X size={19} />
              </button>
            </div>

            <h2
              id="drive-delete-title"
              className="mt-6 text-2xl font-bold text-white"
            >
              Approve permanent deletion?
            </h2>
            <p className="mt-4 leading-7 text-gray-400">
              This queues guarded deletion of the Nextcloud account and exact
              dataset for <strong className="text-white">@{approvalAccount.website_username}</strong>.
              This action is intentionally separate from role removal.
            </p>

            <div className="mt-5 rounded-2xl border border-red-400/20 bg-red-400/[0.07] p-4 text-sm text-red-100">
              <p className="font-medium">Dataset scheduled for deletion</p>
              <p className="mt-2 break-all font-mono text-xs text-red-200/75">
                {approvalAccount.dataset_name}
              </p>
            </div>

            <label className="mt-6 block text-sm font-medium text-gray-300">
              Type <span className="text-white">{approvalAccount.website_username}</span> to confirm
              <input
                value={confirmation}
                onChange={(event) => setConfirmation(event.target.value)}
                autoComplete="off"
                className="mt-3 w-full rounded-xl border border-white/10 bg-black/20 px-4 py-3 text-white outline-none transition placeholder:text-gray-600 focus:border-red-400/40"
                placeholder={approvalAccount.website_username}
              />
            </label>

            <div className="mt-7 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
              <button
                type="button"
                disabled={Boolean(workingUserId)}
                onClick={closeApproval}
                className="rounded-xl border border-white/10 px-5 py-3 text-sm font-medium text-gray-300 transition hover:bg-white/5 disabled:opacity-50"
              >
                Keep data
              </button>
              <button
                type="button"
                disabled={
                  confirmation !== approvalAccount.website_username ||
                  Boolean(workingUserId)
                }
                onClick={approveDeletion}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-red-500 px-5 py-3 text-sm font-semibold text-white transition hover:bg-red-400 disabled:cursor-not-allowed disabled:opacity-40"
              >
                <Trash2 size={16} />
                {workingUserId ? "Queuing…" : "Approve permanent deletion"}
              </button>
            </div>
          </div>
        </div>
      )}

      {cancelAccount && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/75 p-4 backdrop-blur-sm">
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="drive-cancel-title"
            className="w-full max-w-md rounded-3xl border border-blue-400/20 bg-[#071b1a] p-6 shadow-2xl md:p-8"
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-400/10 text-blue-300">
                <RotateCcw size={22} />
              </div>
              <button
                type="button"
                disabled={Boolean(workingUserId)}
                onClick={() => setCancelAccount(null)}
                className="rounded-lg p-2 text-gray-500 transition hover:bg-white/5 hover:text-white disabled:opacity-50"
                aria-label="Close cancellation confirmation"
              >
                <X size={19} />
              </button>
            </div>

            <h2
              id="drive-cancel-title"
              className="mt-6 text-2xl font-bold text-white"
            >
              Cancel scheduled deletion?
            </h2>
            <p className="mt-4 leading-7 text-gray-400">
              The dataset for <strong className="text-white">@{cancelAccount.website_username}</strong> will remain preserved in a suspended state. This does not restore Drive access.
            </p>

            <div className="mt-7 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
              <button
                type="button"
                disabled={Boolean(workingUserId)}
                onClick={() => setCancelAccount(null)}
                className="rounded-xl border border-white/10 px-5 py-3 text-sm font-medium text-gray-300 transition hover:bg-white/5 disabled:opacity-50"
              >
                Go back
              </button>
              <button
                type="button"
                disabled={Boolean(workingUserId)}
                onClick={cancelDeletion}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-500 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-400 disabled:opacity-50"
              >
                <RotateCcw size={16} />
                {workingUserId ? "Cancelling…" : "Cancel deletion"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}