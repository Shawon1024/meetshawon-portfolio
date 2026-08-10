"use client";

import {
  Camera,
  ImageUp,
  Loader2,
  Trash2,
  X,
} from "lucide-react";
import {
  ChangeEvent,
  useCallback,
  useRef,
  useState,
} from "react";
import Cropper, {
  Area,
} from "react-easy-crop";

import ProfileAvatar from "../ui/ProfileAvatar";
import { createClient } from "../../lib/supabase/client";

interface AvatarUploaderProps {
  userId: string;

  initialAvatarUrl:
    | string
    | null;

  displayName: string;

  gender:
    | string
    | null;

  onAvatarChange?: (
    avatarUrl:
      | string
      | null,
  ) => void;
}

const MAX_FILE_SIZE =
  5 * 1024 * 1024;

const ALLOWED_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
];

const OUTPUT_SIZE =
  512;

const OUTPUT_TYPE =
  "image/jpeg";

const OUTPUT_QUALITY =
  0.92;

export default function AvatarUploader({
  userId,
  initialAvatarUrl,
  displayName,
  gender,
  onAvatarChange,
}: AvatarUploaderProps) {
  const supabase =
    createClient();

  const inputRef =
    useRef<HTMLInputElement | null>(
      null,
    );

  const [
    avatarUrl,
    setAvatarUrl,
  ] =
    useState<string | null>(
      initialAvatarUrl,
    );

  const [
    uploading,
    setUploading,
  ] =
    useState(false);

  const [
    deleting,
    setDeleting,
  ] =
    useState(false);

  const [
    error,
    setError,
  ] =
    useState("");

  // --------------------------------------------------
  // CROP STATE
  // --------------------------------------------------

  const [
    cropModalOpen,
    setCropModalOpen,
  ] =
    useState(false);

  const [
    cropImageUrl,
    setCropImageUrl,
  ] =
    useState<string | null>(
      null,
    );

  const [
    crop,
    setCrop,
  ] =
    useState({
      x: 0,
      y: 0,
    });

  const [
    zoom,
    setZoom,
  ] =
    useState(1);

  const [
    croppedAreaPixels,
    setCroppedAreaPixels,
  ] =
    useState<Area | null>(
      null,
    );

  // --------------------------------------------------
  // UPDATE PROFILE
  // --------------------------------------------------

  const updateProfileAvatar =
    async (
      value:
        | string
        | null,
    ) => {
      const {
        error,
      } = await supabase
        .from("profiles")
        .update({
          avatar_url:
            value,
        })
        .eq(
          "id",
          userId,
        );

      if (error) {
        throw error;
      }
    };

  // --------------------------------------------------
  // DELETE STORAGE FILES
  // --------------------------------------------------

  const deleteExistingAvatarFiles =
    async () => {
      const {
        data,
        error,
      } =
        await supabase.storage
          .from(
            "avatars",
          )
          .list(
            userId,
          );

      if (error) {
        throw error;
      }

      const files =
        data?.map(
          (
            item,
          ) =>
            `${userId}/${item.name}`,
        ) ?? [];

      if (
        files.length ===
        0
      ) {
        return;
      }

      const {
        error:
          removeError,
      } =
        await supabase.storage
          .from(
            "avatars",
          )
          .remove(
            files,
          );

      if (
        removeError
      ) {
        throw removeError;
      }
    };

  // --------------------------------------------------
  // IMAGE HELPERS
  // --------------------------------------------------

  const createImage =
    (
      url: string,
    ) =>
      new Promise<HTMLImageElement>(
        (
          resolve,
          reject,
        ) => {
          const image =
            new Image();

          image.onload =
            () =>
              resolve(
                image,
              );

          image.onerror =
            reject;

          image.src =
            url;
        },
      );

  const getCroppedBlob =
    async (
      imageSrc: string,
      pixelCrop: Area,
    ) => {
      const image =
        await createImage(
          imageSrc,
        );

      const canvas =
        document.createElement(
          "canvas",
        );

      const context =
        canvas.getContext(
          "2d",
        );

      if (!context) {
        throw new Error(
          "Your browser could not prepare the cropped image.",
        );
      }

      canvas.width =
        OUTPUT_SIZE;

      canvas.height =
        OUTPUT_SIZE;

      context.imageSmoothingEnabled =
        true;

      context.imageSmoothingQuality =
        "high";

      context.drawImage(
        image,

        pixelCrop.x,
        pixelCrop.y,
        pixelCrop.width,
        pixelCrop.height,

        0,
        0,
        OUTPUT_SIZE,
        OUTPUT_SIZE,
      );

      return new Promise<Blob>(
        (
          resolve,
          reject,
        ) => {
          canvas.toBlob(
            (
              blob,
            ) => {
              if (!blob) {
                reject(
                  new Error(
                    "The cropped image could not be created.",
                  ),
                );

                return;
              }

              resolve(
                blob,
              );
            },

            OUTPUT_TYPE,
            OUTPUT_QUALITY,
          );
        },
      );
    };

  // --------------------------------------------------
  // CROP CALLBACK
  // --------------------------------------------------

  const onCropComplete =
    useCallback(
      (
        _croppedArea: Area,
        croppedPixels: Area,
      ) => {
        setCroppedAreaPixels(
          croppedPixels,
        );
      },
      [],
    );

  // --------------------------------------------------
  // SELECT FILE
  // --------------------------------------------------

  const handleFileChange =
    async (
      event:
        ChangeEvent<HTMLInputElement>,
    ) => {
      const file =
        event.target.files?.[0];

      event.target.value =
        "";

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

      if (
        cropImageUrl
      ) {
        URL.revokeObjectURL(
          cropImageUrl,
        );
      }

      const previewUrl =
        URL.createObjectURL(
          file,
        );

      setCropImageUrl(
        previewUrl,
      );

      setCrop({
        x: 0,
        y: 0,
      });

      setZoom(
        1,
      );

      setCroppedAreaPixels(
        null,
      );

      setCropModalOpen(
        true,
      );
    };

  // --------------------------------------------------
  // CLOSE CROP MODAL
  // --------------------------------------------------

  const closeCropModal =
    () => {
      if (uploading) {
        return;
      }

      if (
        cropImageUrl
      ) {
        URL.revokeObjectURL(
          cropImageUrl,
        );
      }

      setCropImageUrl(
        null,
      );

      setCropModalOpen(
        false,
      );

      setCrop({
        x: 0,
        y: 0,
      });

      setZoom(
        1,
      );

      setCroppedAreaPixels(
        null,
      );
    };

  // --------------------------------------------------
  // SAVE CROPPED PHOTO
  // --------------------------------------------------

  const saveCroppedPhoto =
    async () => {
      if (
        !cropImageUrl ||
        !croppedAreaPixels
      ) {
        setError(
          "The crop could not be prepared. Please choose the photo again.",
        );

        return;
      }

      setError("");

      try {
        setUploading(
          true,
        );

        const croppedBlob =
          await getCroppedBlob(
            cropImageUrl,
            croppedAreaPixels,
          );

        await deleteExistingAvatarFiles();

        const filePath =
          `${userId}/avatar.jpg`;

        const {
          error:
            uploadError,
        } =
          await supabase.storage
            .from(
              "avatars",
            )
            .upload(
              filePath,
              croppedBlob,
              {
                cacheControl:
                  "3600",

                upsert:
                  true,

                contentType:
                  OUTPUT_TYPE,
              },
            );

        if (
          uploadError
        ) {
          throw uploadError;
        }

        const {
          data:
            publicUrlData,
        } =
          supabase.storage
            .from(
              "avatars",
            )
            .getPublicUrl(
              filePath,
            );

        const newAvatarUrl =
          `${publicUrlData.publicUrl}?v=${Date.now()}`;

        await updateProfileAvatar(
          newAvatarUrl,
        );

        setAvatarUrl(
          newAvatarUrl,
        );

        onAvatarChange?.(
          newAvatarUrl,
        );

        if (
          cropImageUrl
        ) {
          URL.revokeObjectURL(
            cropImageUrl,
          );
        }

        setCropImageUrl(
          null,
        );

        setCropModalOpen(
          false,
        );

        setCrop({
          x: 0,
          y: 0,
        });

        setZoom(
          1,
        );

        setCroppedAreaPixels(
          null,
        );
      } catch (
        error
      ) {
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
        setUploading(
          false,
        );
      }
    };

  // --------------------------------------------------
  // REMOVE
  // --------------------------------------------------

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
        setDeleting(
          true,
        );

        await deleteExistingAvatarFiles();

        /*
         * We store NULL rather than a default image URL.
         * ProfileAvatar then falls back to the gender-based
         * or neutral avatar automatically.
         */

        await updateProfileAvatar(
          null,
        );

        setAvatarUrl(
          null,
        );

        onAvatarChange?.(
          null,
        );
      } catch (
        error
      ) {
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
        setDeleting(
          false,
        );
      }
    };

  // --------------------------------------------------
  // PAGE
  // --------------------------------------------------

  return (
    <>
      <div>
        <input
          ref={
            inputRef
          }
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
            <ProfileAvatar
              avatarUrl={
                avatarUrl
              }
              gender={
                gender
              }
              name={
                displayName
              }
              className="h-28 w-28"
              iconSize={
                42
              }
            />
          </div>

          {/* Controls */}

          <div className="flex-1">
            <h3 className="font-medium text-white">
              Profile photo
            </h3>

            <p className="mt-2 max-w-lg text-sm leading-6 text-gray-500">
              Upload a JPG, PNG, or WebP image. Maximum size: 5 MB. You can
              crop and position the photo before it is saved.
              {!avatarUrl &&
                " Until you upload a photo, your default avatar is selected from your profile information."}
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
                className="inline-flex cursor-pointer items-center gap-2 rounded-xl border border-green-400/20 bg-green-400/10 px-4 py-2.5 text-sm font-medium text-green-300 transition hover:bg-green-400/15 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {uploading ? (
                  <Loader2
                    size={
                      16
                    }
                    className="animate-spin"
                  />
                ) : (
                  <ImageUp
                    size={
                      16
                    }
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
                  className="inline-flex cursor-pointer items-center gap-2 rounded-xl border border-red-400/20 bg-red-400/[0.04] px-4 py-2.5 text-sm font-medium text-red-300 transition hover:bg-red-400/10 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {deleting ? (
                    <Loader2
                      size={
                        16
                      }
                      className="animate-spin"
                    />
                  ) : (
                    <Trash2
                      size={
                        16
                      }
                    />
                  )}

                  {deleting
                    ? "Removing..."
                    : "Remove Photo"}
                </button>
              )}
            </div>

            {!avatarUrl && (
              <p className="mt-3 text-xs text-gray-600">
                Default avatar currently in use.
              </p>
            )}
          </div>
        </div>

        {error && (
          <p
            role="alert"
            className="mt-5 rounded-xl border border-red-400/20 bg-red-400/10 px-4 py-3 text-sm text-red-300"
          >
            {
              error
            }
          </p>
        )}
      </div>

      {/* =================================================
          CROP MODAL
      ================================================= */}

      {cropModalOpen &&
        cropImageUrl && (
          <div
            className="fixed inset-0 z-[220] flex items-center justify-center bg-black/80 px-4 py-8 backdrop-blur-sm"
            role="dialog"
            aria-modal="true"
            aria-labelledby="crop-photo-title"
            onMouseDown={(
              event,
            ) => {
              if (
                event.target ===
                event.currentTarget
              ) {
                closeCropModal();
              }
            }}
          >
            <div className="relative w-full max-w-2xl rounded-3xl border border-white/10 bg-[#102A2A] p-5 shadow-2xl md:p-7">
              <button
                type="button"
                disabled={
                  uploading
                }
                onClick={
                  closeCropModal
                }
                className="absolute right-5 top-5 z-20 inline-flex h-9 w-9 items-center justify-center rounded-lg text-gray-400 transition hover:bg-white/5 hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
                aria-label="Close crop photo"
              >
                <X
                  size={
                    20
                  }
                />
              </button>

              <div className="pr-12">
                <p className="text-sm font-medium uppercase tracking-[0.2em] text-green-400">
                  Profile Photo
                </p>

                <h2
                  id="crop-photo-title"
                  className="mt-2 text-2xl font-semibold text-white"
                >
                  Crop your photo
                </h2>

                <p className="mt-3 text-sm leading-6 text-gray-400">
                  Drag the image to position it inside the circle, then use
                  the zoom control if needed.
                </p>
              </div>

              <div className="relative mt-6 h-[380px] overflow-hidden rounded-2xl border border-white/10 bg-black">
                <Cropper
                  image={
                    cropImageUrl
                  }
                  crop={
                    crop
                  }
                  zoom={
                    zoom
                  }
                  aspect={
                    1
                  }
                  cropShape="round"
                  showGrid={
                    false
                  }
                  objectFit="contain"
                  onCropChange={
                    setCrop
                  }
                  onZoomChange={
                    setZoom
                  }
                  onCropComplete={
                    onCropComplete
                  }
                />
              </div>

              <div className="mt-6">
                <div className="flex items-center justify-between gap-4">
                  <label
                    htmlFor="avatar-zoom"
                    className="text-sm font-medium text-gray-300"
                  >
                    Zoom
                  </label>

                  <span className="text-xs text-gray-500">
                    {zoom.toFixed(
                      1,
                    )}
                    ×
                  </span>
                </div>

                <input
                  id="avatar-zoom"
                  type="range"
                  min={
                    1
                  }
                  max={
                    3
                  }
                  step={
                    0.1
                  }
                  value={
                    zoom
                  }
                  onChange={(
                    event,
                  ) =>
                    setZoom(
                      Number(
                        event.target
                          .value,
                      ),
                    )
                  }
                  disabled={
                    uploading
                  }
                  className="mt-3 w-full accent-green-400 disabled:opacity-50"
                />
              </div>

              <p className="mt-4 text-xs leading-5 text-gray-500">
                The saved profile photo will be cropped to a 512 × 512 square
                image and displayed as a circle throughout the site.
              </p>

              <div className="mt-7 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  disabled={
                    uploading
                  }
                  onClick={
                    closeCropModal
                  }
                  className="rounded-xl border border-white/10 px-5 py-3 text-sm font-medium text-gray-300 transition hover:border-white/20 hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Cancel
                </button>

                <button
                  type="button"
                  disabled={
                    uploading ||
                    !croppedAreaPixels
                  }
                  onClick={() => {
                    void saveCroppedPhoto();
                  }}
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-green-500 px-5 py-3 text-sm font-medium text-black transition hover:bg-green-400 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {uploading ? (
                    <Loader2
                      size={
                        17
                      }
                      className="animate-spin"
                    />
                  ) : (
                    <Camera
                      size={
                        17
                      }
                    />
                  )}

                  {uploading
                    ? "Saving..."
                    : "Save Crop"}
                </button>
              </div>
            </div>
          </div>
        )}
    </>
  );
}