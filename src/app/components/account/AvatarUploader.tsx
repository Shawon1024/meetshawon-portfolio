"use client";

import {
  Camera,
  ImageUp,
  Loader2,
  Trash2,
} from "lucide-react";
import {
  ChangeEvent,
  useRef,
  useState,
} from "react";

import { createClient } from "../../lib/supabase/client";

interface AvatarUploaderProps {
  userId: string;
  initialAvatarUrl: string | null;
  displayName: string;
  onAvatarChange?: (
    avatarUrl: string | null,
  ) => void;
}

const MAX_FILE_SIZE =
  5 * 1024 * 1024;

const ALLOWED_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
];

export default function AvatarUploader({
  userId,
  initialAvatarUrl,
  displayName,
  onAvatarChange,
}: AvatarUploaderProps) {
  const supabase =
    createClient();

  const inputRef =
    useRef<HTMLInputElement | null>(
      null,
    );

  const [avatarUrl, setAvatarUrl] =
    useState<string | null>(
      initialAvatarUrl,
    );

  const [uploading, setUploading] =
    useState(false);

  const [deleting, setDeleting] =
    useState(false);

  const [error, setError] =
    useState("");

  const getInitial = () => {
    return (
      displayName
        .trim()
        .charAt(0)
        .toUpperCase() || "U"
    );
  };

  const getFileExtension = (
    file: File,
  ) => {
    if (
      file.type ===
      "image/png"
    ) {
      return "png";
    }

    if (
      file.type ===
      "image/webp"
    ) {
      return "webp";
    }

    return "jpg";
  };

  const updateProfileAvatar =
    async (
      value: string | null,
    ) => {
      const {
        error,
      } = await supabase
        .from("profiles")
        .update({
          avatar_url: value,
        })
        .eq(
          "id",
          userId,
        );

      if (error) {
        throw error;
      }
    };

  const deleteExistingAvatarFiles =
    async () => {
      const {
        data,
        error,
      } = await supabase.storage
        .from("avatars")
        .list(userId);

      if (error) {
        throw error;
      }

      const files =
        data?.map(
          (item) =>
            `${userId}/${item.name}`,
        ) ?? [];

      if (
        files.length === 0
      ) {
        return;
      }

      const {
        error: removeError,
      } = await supabase.storage
        .from("avatars")
        .remove(files);

      if (removeError) {
        throw removeError;
      }
    };

  const handleFileChange =
    async (
      event: ChangeEvent<HTMLInputElement>,
    ) => {
      const file =
        event.target.files?.[0];

      event.target.value = "";

      if (!file) {
        return;
      }

      setError("");

      if (
        !ALLOWED_TYPES.includes(
          file.type,
        )
      ) {
        setError(
          "Please upload a JPG, PNG, or WebP image.",
        );
        return;
      }

      if (
        file.size >
        MAX_FILE_SIZE
      ) {
        setError(
          "Profile photos must be 5 MB or smaller.",
        );
        return;
      }

      try {
        setUploading(true);

        await deleteExistingAvatarFiles();

        const extension =
          getFileExtension(file);

        const filePath =
          `${userId}/avatar.${extension}`;

        const {
          error: uploadError,
        } = await supabase.storage
          .from("avatars")
          .upload(
            filePath,
            file,
            {
              cacheControl:
                "3600",

              upsert:
                true,

              contentType:
                file.type,
            },
          );

        if (uploadError) {
          throw uploadError;
        }

        const {
          data: publicUrlData,
        } = supabase.storage
          .from("avatars")
          .getPublicUrl(
            filePath,
          );

        const newAvatarUrl =
          `${
            publicUrlData.publicUrl
          }?v=${Date.now()}`;

        await updateProfileAvatar(
          newAvatarUrl,
        );

        setAvatarUrl(
          newAvatarUrl,
        );

        onAvatarChange?.(
          newAvatarUrl,
        );
      } catch (error) {
        console.error(
          "Avatar upload failed:",
          error,
        );

        setError(
          error instanceof Error
            ? error.message
            : "Your profile photo could not be uploaded.",
        );
      } finally {
        setUploading(false);
      }
    };

  const removeAvatar =
    async () => {
      if (
        deleting ||
        uploading
      ) {
        return;
      }

      setError("");

      try {
        setDeleting(true);

        await deleteExistingAvatarFiles();

        await updateProfileAvatar(
          null,
        );

        setAvatarUrl(null);

        onAvatarChange?.(
          null,
        );
      } catch (error) {
        console.error(
          "Avatar removal failed:",
          error,
        );

        setError(
          error instanceof Error
            ? error.message
            : "Your profile photo could not be removed.",
        );
      } finally {
        setDeleting(false);
      }
    };

  return (
    <div>
      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        onChange={(
          event,
        ) => {
          void handleFileChange(
            event,
          );
        }}
        className="hidden"
      />

      <div className="flex flex-col gap-6 sm:flex-row sm:items-center">
        {/* Avatar */}

        <div className="relative shrink-0">
          {avatarUrl ? (
            <img
              src={avatarUrl}
              alt={`${displayName} profile photo`}
              className="h-28 w-28 rounded-full border border-white/10 object-cover"
            />
          ) : (
            <div className="flex h-28 w-28 items-center justify-center rounded-full border border-white/10 bg-green-400/10 text-3xl font-bold text-green-300">
              {getInitial()}
            </div>
          )}

          <button
            type="button"
            disabled={
              uploading ||
              deleting
            }
            onClick={() =>
              inputRef.current?.click()
            }
            className="absolute bottom-0 right-0 inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-[#102A2A] text-white shadow-lg transition hover:border-green-400/40 hover:text-green-300 disabled:cursor-not-allowed disabled:opacity-50"
            aria-label="Change profile photo"
          >
            {uploading ? (
              <Loader2
                size={18}
                className="animate-spin"
              />
            ) : (
              <Camera
                size={18}
              />
            )}
          </button>
        </div>

        {/* Controls */}

        <div className="flex-1">
          <h3 className="font-medium text-white">
            Profile photo
          </h3>

          <p className="mt-2 max-w-lg text-sm leading-6 text-gray-500">
            Upload a JPG, PNG, or WebP image. Maximum size: 5 MB.
          </p>

          <div className="mt-4 flex flex-wrap gap-3">
            <button
              type="button"
              disabled={
                uploading ||
                deleting
              }
              onClick={() =>
                inputRef.current?.click()
              }
              className="inline-flex items-center gap-2 rounded-xl border border-green-400/20 bg-green-400/10 px-4 py-2.5 text-sm font-medium text-green-300 transition hover:bg-green-400/15 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {uploading ? (
                <Loader2
                  size={16}
                  className="animate-spin"
                />
              ) : (
                <ImageUp
                  size={16}
                />
              )}

              {uploading
                ? "Uploading..."
                : avatarUrl
                  ? "Change Photo"
                  : "Upload Photo"}
            </button>

            {avatarUrl && (
              <button
                type="button"
                disabled={
                  uploading ||
                  deleting
                }
                onClick={() => {
                  void removeAvatar();
                }}
                className="inline-flex items-center gap-2 rounded-xl border border-red-400/20 px-4 py-2.5 text-sm font-medium text-red-300 transition hover:bg-red-400/10 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {deleting ? (
                  <Loader2
                    size={16}
                    className="animate-spin"
                  />
                ) : (
                  <Trash2
                    size={16}
                  />
                )}

                {deleting
                  ? "Removing..."
                  : "Remove"}
              </button>
            )}
          </div>
        </div>
      </div>

      {error && (
        <p
          role="alert"
          className="mt-5 rounded-xl border border-red-400/20 bg-red-400/10 px-4 py-3 text-sm text-red-300"
        >
          {error}
        </p>
      )}
    </div>
  );
}