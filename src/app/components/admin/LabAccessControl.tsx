"use client";

import {
  FlaskConical,
  PauseCircle,
  RotateCcw,
  ShieldCheck,
  ShieldX,
} from "lucide-react";
import { useState } from "react";

import { createClient } from "../../lib/supabase/client";

export type LabAccessLevel = "member" | "operator";
export type LabAccessStatus = "active" | "suspended" | "revoked";

export interface LabAccessMembership {
  user_id: string;
  access_level: LabAccessLevel;
  status: LabAccessStatus;
}

interface LabAccessControlProps {
  userId: string;
  identity: string;
  currentUserId: string;
  automaticAdminAccess: boolean;
  initialMembership: LabAccessMembership | null;
}

const statusStyles: Record<LabAccessStatus, string> = {
  active: "border-emerald-400/20 bg-emerald-400/10 text-emerald-300",
  suspended: "border-amber-400/20 bg-amber-400/10 text-amber-300",
  revoked: "border-red-400/20 bg-red-400/10 text-red-300",
};

export default function LabAccessControl({
  userId,
  identity,
  currentUserId,
  automaticAdminAccess,
  initialMembership,
}: LabAccessControlProps) {
  const [membership, setMembership] =
    useState<LabAccessMembership | null>(initialMembership);
  const [selectedLevel, setSelectedLevel] = useState<LabAccessLevel>(
    initialMembership?.access_level ?? "member",
  );
  const [working, setWorking] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  const saveMembership = async (
    accessLevel: LabAccessLevel,
    status: LabAccessStatus,
  ) => {
    try {
      setWorking(true);
      setError("");
      setNotice("");

      const supabase = createClient();
      const updatedAt = new Date().toISOString();

      const { data, error: updateError } = await supabase
        .from("lab_access_members")
        .upsert(
          {
            user_id: userId,
            access_level: accessLevel,
            status,
            granted_by: currentUserId,
            updated_at: updatedAt,
          },
          {
            onConflict: "user_id",
          },
        )
        .select("user_id, access_level, status")
        .single();

      if (updateError) {
        throw updateError;
      }

      const nextMembership = data as LabAccessMembership;
      setMembership(nextMembership);
      setSelectedLevel(nextMembership.access_level);

      const actionLabel =
        status === "active"
          ? membership?.status === "suspended"
            ? "restored"
            : "granted"
          : status;

      setNotice(`Lab access ${actionLabel} for ${identity}.`);
    } catch (unexpectedError) {
      setError(
        unexpectedError instanceof Error
          ? unexpectedError.message
          : "Lab access could not be updated.",
      );
    } finally {
      setWorking(false);
    }
  };

  if (automaticAdminAccess) {
    return (
      <div className="flex flex-col gap-3 rounded-2xl border border-emerald-400/15 bg-emerald-400/[0.05] p-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-400/10 text-emerald-300">
            <FlaskConical size={19} aria-hidden="true" />
          </div>
          <div>
            <p className="text-sm font-semibold text-white">Cybersecurity Lab</p>
            <p className="mt-1 text-xs leading-5 text-gray-400">
              Administrators receive automatic Lab access.
            </p>
          </div>
        </div>

        <span className="inline-flex w-fit items-center gap-2 rounded-full border border-emerald-400/20 bg-emerald-400/10 px-3 py-1.5 text-xs font-semibold text-emerald-300">
          <ShieldCheck size={14} aria-hidden="true" />
          Lab Administrator
        </span>
      </div>
    );
  }

  const status = membership?.status ?? null;
  const hasActiveAccess = status === "active";
  const isSuspended = status === "suspended";

  return (
    <div className="rounded-2xl border border-white/10 bg-black/10 p-4">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-400/10 text-emerald-300">
            <FlaskConical size={19} aria-hidden="true" />
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <p className="text-sm font-semibold text-white">Cybersecurity Lab</p>
              {status ? (
                <span
                  className={`rounded-full border px-2.5 py-1 text-[11px] font-semibold capitalize ${statusStyles[status]}`}
                >
                  {status}
                </span>
              ) : (
                <span className="rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-[11px] text-gray-500">
                  No access
                </span>
              )}
            </div>
            <p className="mt-1 text-xs leading-5 text-gray-500">
              Manage this user&apos;s independent Lab entitlement.
            </p>
          </div>
        </div>

        <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:items-center">
          <select
            value={selectedLevel}
            disabled={working}
            onChange={(event) => {
              setSelectedLevel(event.target.value as LabAccessLevel);
            }}
            className="cursor-pointer rounded-xl border border-white/10 bg-[#102A2A] px-3 py-2.5 text-sm text-white outline-none transition focus:border-emerald-400/40 disabled:cursor-not-allowed disabled:opacity-50"
            aria-label={`Lab access level for ${identity}`}
          >
            <option value="member">Lab Member</option>
            <option value="operator">Lab Operator</option>
          </select>

          <button
            type="button"
            disabled={working}
            onClick={() => {
              void saveMembership(selectedLevel, "active");
            }}
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-emerald-400/20 px-3 py-2.5 text-sm font-medium text-emerald-300 transition hover:bg-emerald-400/10 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isSuspended ? (
              <RotateCcw size={16} aria-hidden="true" />
            ) : (
              <ShieldCheck size={16} aria-hidden="true" />
            )}
            {working
              ? "Updating…"
              : isSuspended
                ? "Restore"
                : hasActiveAccess
                  ? "Update access"
                  : "Grant access"}
          </button>

          {hasActiveAccess ? (
            <button
              type="button"
              disabled={working}
              onClick={() => {
                void saveMembership(selectedLevel, "suspended");
              }}
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-amber-400/20 px-3 py-2.5 text-sm font-medium text-amber-300 transition hover:bg-amber-400/10 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <PauseCircle size={16} aria-hidden="true" />
              Suspend
            </button>
          ) : null}

          {membership && status !== "revoked" ? (
            <button
              type="button"
              disabled={working}
              onClick={() => {
                void saveMembership(selectedLevel, "revoked");
              }}
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-red-400/20 px-3 py-2.5 text-sm font-medium text-red-300 transition hover:bg-red-400/10 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <ShieldX size={16} aria-hidden="true" />
              Revoke
            </button>
          ) : null}
        </div>
      </div>

      {error ? (
        <p className="mt-3 text-sm text-red-300" role="alert">
          {error}
        </p>
      ) : null}

      {notice ? (
        <p className="mt-3 text-sm text-emerald-300" role="status">
          {notice}
        </p>
      ) : null}
    </div>
  );
}
