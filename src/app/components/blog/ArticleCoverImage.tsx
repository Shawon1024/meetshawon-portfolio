"use client";

import {
  Maximize2,
  X,
} from "lucide-react";
import {
  useEffect,
  useState,
} from "react";

interface ArticleCoverImageProps {
  src: string;
  alt: string;
}

export default function ArticleCoverImage({
  src,
  alt,
}: ArticleCoverImageProps) {
  const [open, setOpen] =
    useState(false);

  useEffect(() => {
    if (!open) {
      return;
    }

    const handleKeyDown = (
      event: KeyboardEvent,
    ) => {
      if (
        event.key === "Escape"
      ) {
        setOpen(false);
      }
    };

    document.body.style.overflow =
      "hidden";

    window.addEventListener(
      "keydown",
      handleKeyDown,
    );

    return () => {
      document.body.style.overflow =
        "";

      window.removeEventListener(
        "keydown",
        handleKeyDown,
      );
    };
  }, [open]);

  return (
    <>
      {/* Normal article image */}
      <button
        type="button"
        onClick={() =>
          setOpen(true)
        }
        className="group relative mx-auto block w-full max-w-3xl overflow-hidden rounded-2xl border border-white/10 bg-black/20 shadow-xl"
        aria-label="Open cover image"
      >
        <img
          src={src}
          alt={alt}
          className="mx-auto max-h-[460px] w-full object-contain transition duration-300 group-hover:scale-[1.015]"
        />

        {/* Zoom indicator */}
        <div className="absolute right-4 top-4 inline-flex items-center gap-2 rounded-lg border border-white/10 bg-black/60 px-3 py-2 text-xs font-medium text-white opacity-0 backdrop-blur-md transition group-hover:opacity-100">
          <Maximize2
            size={15}
          />

          View image
        </div>
      </button>

      {/* Full-screen viewer */}
      {open && (
        <div
          className="fixed inset-0 z-[200] flex items-center justify-center bg-black/90 p-4 backdrop-blur-sm md:p-8"
          role="dialog"
          aria-modal="true"
          aria-label="Image viewer"
          onMouseDown={(
            event,
          ) => {
            if (
              event.target ===
              event.currentTarget
            ) {
              setOpen(false);
            }
          }}
        >
          {/* Close */}
          <button
            type="button"
            onClick={() =>
              setOpen(false)
            }
            className="absolute right-5 top-5 z-10 inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/10 bg-black/50 text-white transition hover:bg-white/10"
            aria-label="Close image viewer"
          >
            <X size={22} />
          </button>

          {/* Large image */}
          <img
            src={src}
            alt={alt}
            className="max-h-[90vh] max-w-[95vw] rounded-xl object-contain shadow-2xl"
          />
        </div>
      )}
    </>
  );
}