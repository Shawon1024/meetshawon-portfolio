"use client";

import { ChangeEvent, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Archive,
  Eye,
  FileImage,
  FileText,
  ImagePlus,
  Save,
  Send,
  Trash2,
  TriangleAlert,
  X,
} from "lucide-react";
import Image from "next/image";
import MarkdownRenderer from "../blog/MarkdownRenderer";
import { createClient } from "../../lib/supabase/client";

interface ExistingPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  content: string;
  status: "draft" | "published" | "archived";
  featured: boolean;
  category_id: string | null;
  cover_image_url: string | null;
  cover_image_alt: string | null;
}

interface CategoryOption {
  id: string;
  name: string;
  slug: string;
}

interface TagOption {
  id: string;
  name: string;
  slug: string;
}

interface PostEditorFormProps {
  authorId: string;
  currentRole: string | null;
  categories: CategoryOption[];
  tags: TagOption[];
  post?: ExistingPost;
  initialTagIds?: string[];
}

type ConfirmAction =
  | "archive"
  | "delete"
  | null;

type SubmitAction =
  | "draft"
  | "publish"
  | "archive"
  | "delete"
  | null;

export default function PostEditorForm({
  authorId,
  currentRole,
  categories,
  tags,
  post,
  initialTagIds = [],
}: PostEditorFormProps) {
  const router = useRouter();

  const isEditing = Boolean(post);

  const isAdmin =
  currentRole === "admin";

  const [title, setTitle] = useState(
    post?.title ?? "",
  );

  const [slug, setSlug] = useState(
    post?.slug ?? "",
  );

  const [excerpt, setExcerpt] = useState(
    post?.excerpt ?? "",
  );

  const [content, setContent] = useState(
    post?.content ?? "",
  );

  const [featured, setFeatured] = useState(
    post?.featured ?? false,
  );

  const [categoryId, setCategoryId] = useState(
    post?.category_id ?? "",
  );

  const [selectedTagIds, setSelectedTagIds] =
    useState<string[]>(initialTagIds);

  const [coverImageUrl, setCoverImageUrl] =
    useState(post?.cover_image_url ?? "");

  const [coverImageAlt, setCoverImageAlt] =
    useState(post?.cover_image_alt ?? "");

  const [uploadingImage, setUploadingImage] =
    useState(false);

  const [editorMode, setEditorMode] = useState<
    "write" | "preview"
  >("write");

  const [error, setError] = useState("");

  const [submitting, setSubmitting] =
    useState<SubmitAction>(null);

  const [confirmAction, setConfirmAction] =
    useState<ConfirmAction>(null);

  const createSlug = (value: string) => {
    return value
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-");
  };

  const handleTitleChange = (value: string) => {
    const previousAutoSlug =
      createSlug(title);

    setTitle(value);

    if (
      !slug ||
      slug === previousAutoSlug
    ) {
      setSlug(
        createSlug(value),
      );
    }
  };

  const toggleTag = (tagId: string) => {
    setSelectedTagIds(
      (current) => {
        if (
          current.includes(
            tagId,
          )
        ) {
          return current.filter(
            (id) =>
              id !== tagId,
          );
        }

        return [
          ...current,
          tagId,
        ];
      },
    );
  };

  const validatePost = () => {
    setError("");

    if (!title.trim()) {
      setError(
        "Please enter a title.",
      );
      return false;
    }

    if (!slug.trim()) {
      setError(
        "Please enter a slug.",
      );
      return false;
    }

    if (!content.trim()) {
      setError(
        "Please add article content.",
      );
      return false;
    }

    const slugPattern =
      /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

    if (
      !slugPattern.test(
        slug.trim(),
      )
    ) {
      setError(
        "The slug may only contain lowercase letters, numbers, and hyphens.",
      );

      return false;
    }

    if (
      coverImageUrl &&
      !coverImageAlt.trim()
    ) {
      setError(
        "Please add alt text for the cover image.",
      );

      return false;
    }

    return true;
  };

  const uploadCoverImage = async (
    event: ChangeEvent<HTMLInputElement>,
  ) => {
    const file =
      event.target.files?.[0];

    if (!file) {
      return;
    }

    setError("");

    const allowedTypes = [
      "image/jpeg",
      "image/png",
      "image/webp",
    ];

    if (
      !allowedTypes.includes(
        file.type,
      )
    ) {
      setError(
        "Please upload a JPG, PNG, or WebP image.",
      );

      event.target.value = "";
      return;
    }

    const maxFileSize =
      5 * 1024 * 1024;

    if (
      file.size >
      maxFileSize
    ) {
      setError(
        "The image must be 5 MB or smaller.",
      );

      event.target.value = "";
      return;
    }

    try {
      setUploadingImage(true);

      const supabase =
        createClient();

      const extension =
        file.name
          .split(".")
          .pop()
          ?.toLowerCase() ??
        "jpg";

      const uniqueName =
        `${crypto.randomUUID()}.${extension}`;

      const storagePath =
        `${authorId}/${uniqueName}`;

      const {
        error: uploadError,
      } = await supabase.storage
        .from("blog-image")
        .upload(
          storagePath,
          file,
          {
            cacheControl:
              "3600",
            upsert: false,
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
        .from("blog-image")
        .getPublicUrl(
          storagePath,
        );

      if (
        !publicUrlData
          .publicUrl
      ) {
        throw new Error(
          "The image was uploaded, but its public URL could not be created.",
        );
      }

      setCoverImageUrl(
        publicUrlData.publicUrl,
      );
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "The image could not be uploaded.",
      );
    } finally {
      setUploadingImage(false);

      event.target.value = "";
    }
  };

  const savePostTags = async (
    postId: string,
  ) => {
    const supabase =
      createClient();

    const {
      error: deleteError,
    } = await supabase
      .from("post_tags")
      .delete()
      .eq(
        "post_id",
        postId,
      );

    if (deleteError) {
      throw deleteError;
    }

    if (
      selectedTagIds.length ===
      0
    ) {
      return;
    }

    const tagRelationships =
      selectedTagIds.map(
        (tagId) => ({
          post_id: postId,
          tag_id: tagId,
        }),
      );

    const {
      error: insertError,
    } = await supabase
      .from("post_tags")
      .insert(
        tagRelationships,
      );

    if (insertError) {
      throw insertError;
    }
  };

  const savePost = async (
    status:
      | "draft"
      | "published",
  ) => {
    setError("");

    if (!validatePost()) {
      return;
    }

    try {
      setSubmitting(
        status ===
          "published"
          ? "publish"
          : "draft",
      );

      const supabase =
        createClient();

  const postData = {
    category_id:
      categoryId || null,

    title:
      title.trim(),

    slug:
      slug.trim(),

    excerpt:
      excerpt.trim() ||
      null,

    content:
      content.trim(),

    status,

    featured:
      isAdmin
        ? featured
        : false,

    cover_image_url:
      coverImageUrl ||
      null,

    cover_image_alt:
      coverImageUrl
        ? coverImageAlt.trim()
        : null,

    published_at:
      status ===
      "published"
        ? new Date().toISOString()
        : null,
  };

      let savedPostId:
        | string
        | null = null;

      if (post?.id) {
        const {
          data,
          error:
            updateError,
        } = await supabase
          .from("posts")
          .update(
            postData,
          )
          .eq(
            "id",
            post.id,
          )
          .select("id")
          .single();

        if (updateError) {
          if (
            updateError.code ===
            "23505"
          ) {
            throw new Error(
              "That slug is already being used by another post.",
            );
          }

          throw updateError;
        }

        savedPostId =
          data.id;
      } else {
        const {
          data,
          error:
            insertError,
        } = await supabase
          .from("posts")
        .insert({
          ...postData,
          author_id:
            authorId,
        })
          .select("id")
          .single();

        if (insertError) {
          if (
            insertError.code ===
            "23505"
          ) {
            throw new Error(
              "That slug is already being used by another post.",
            );
          }

          throw insertError;
        }

        savedPostId =
          data.id;
      }

      if (!savedPostId) {
        throw new Error(
          "The post was saved, but its ID could not be retrieved.",
        );
      }

      await savePostTags(
        savedPostId,
      );

      router.push(
        "/admin/posts",
      );

      router.refresh();
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "The post could not be saved.",
      );
    } finally {
      setSubmitting(null);
    }
  };

  const archivePost =
    async () => {
      if (!post?.id) {
        return;
      }

      try {
        setSubmitting(
          "archive",
        );

        setError("");

        const supabase =
          createClient();

        const { error } =
          await supabase
            .from("posts")
            .update({
              status:
                "archived",

              published_at:
                null,
            })
            .eq(
              "id",
              post.id,
            );

        if (error) {
          throw error;
        }

        setConfirmAction(
          null,
        );

        router.push(
          "/admin/posts",
        );

        router.refresh();
      } catch (error) {
        setError(
          error instanceof Error
            ? error.message
            : "The post could not be archived.",
        );
      } finally {
        setSubmitting(null);
      }
    };

  const deletePost =
    async () => {
      if (!post?.id) {
        return;
      }

      try {
        setSubmitting(
          "delete",
        );

        setError("");

        const supabase =
          createClient();

        const { error } =
          await supabase
            .from("posts")
            .delete()
            .eq(
              "id",
              post.id,
            );

        if (error) {
          throw error;
        }

        setConfirmAction(
          null,
        );

        router.push(
          "/admin/posts",
        );

        router.refresh();
      } catch (error) {
        setError(
          error instanceof Error
            ? error.message
            : "The post could not be deleted.",
        );
      } finally {
        setSubmitting(null);
      }
    };

  const closeConfirmation =
    () => {
      if (
        submitting ===
          "archive" ||
        submitting ===
          "delete"
      ) {
        return;
      }

      setConfirmAction(null);
    };

  const inputStyles =
    "mt-2 w-full rounded-xl border border-white/10 bg-black/10 px-4 py-3 text-white outline-none transition placeholder:text-gray-600 focus:border-green-400 disabled:cursor-not-allowed disabled:opacity-60";

  return (
    <>
      <form
        className="space-y-7"
        onSubmit={(
          event,
        ) => {
          event.preventDefault();

          void savePost(
            "draft",
          );
        }}
      >
        {/* TITLE */}

        <label className="block text-sm font-medium text-gray-300">
          Title

          <input
            type="text"
            value={title}
            onChange={(
              event,
            ) =>
              handleTitleChange(
                event.target
                  .value,
              )
            }
            className={
              inputStyles
            }
            placeholder="Article title"
            maxLength={200}
            disabled={
              submitting !==
              null
            }
            required
          />
        </label>

        {/* SLUG */}

        <label className="block text-sm font-medium text-gray-300">
          Slug

          <div className="mt-2 flex overflow-hidden rounded-xl border border-white/10 bg-black/10 transition focus-within:border-green-400">
            <span className="flex items-center border-r border-white/10 px-3 text-sm text-gray-500">
              /blog/
            </span>

            <input
              type="text"
              value={slug}
              onChange={(
                event,
              ) =>
                setSlug(
                  createSlug(
                    event.target
                      .value,
                  ),
                )
              }
              className="min-w-0 flex-1 bg-transparent px-4 py-3 text-white outline-none disabled:cursor-not-allowed disabled:opacity-60"
              placeholder="article-slug"
              maxLength={200}
              disabled={
                submitting !==
                null
              }
              required
            />
          </div>

          <p className="mt-2 text-xs text-gray-500">
            Public URL:
            {" "}
            /blog/
            {slug ||
              "article-slug"}
          </p>
        </label>

        {/* EXCERPT */}

        <label className="block text-sm font-medium text-gray-300">
          Excerpt

          <textarea
            value={excerpt}
            onChange={(
              event,
            ) =>
              setExcerpt(
                event.target
                  .value,
              )
            }
            rows={3}
            maxLength={500}
            className={`${inputStyles} resize-y`}
            placeholder="Short description shown on blog cards..."
            disabled={
              submitting !==
              null
            }
          />

          <p className="mt-2 text-right text-xs text-gray-500">
            {excerpt.length}
            /500
          </p>
        </label>

        {/* CATEGORY */}

        <label className="block text-sm font-medium text-gray-300">
          Category

          <select
            value={
              categoryId
            }
            onChange={(
              event,
            ) =>
              setCategoryId(
                event.target
                  .value,
              )
            }
            disabled={
              submitting !==
              null
            }
            className={inputStyles}
          >
            <option value="">
              No category
            </option>

            {categories.map(
              (category) => (
                <option
                  key={
                    category.id
                  }
                  value={
                    category.id
                  }
                >
                  {
                    category.name
                  }
                </option>
              ),
            )}
          </select>
        </label>

        {/* TAGS */}

        <div>
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div>
              <p className="text-sm font-medium text-gray-300">
                Tags
              </p>

              <p className="mt-1 text-xs text-gray-500">
                Select all topics
                relevant to this
                article.
              </p>
            </div>

            <p className="text-xs text-gray-500">
              {
                selectedTagIds.length
              }{" "}
              selected
            </p>
          </div>

          {tags.length ===
          0 ? (
            <div className="mt-3 rounded-xl border border-white/10 bg-black/10 p-4 text-sm text-gray-500">
              No tags are
              available yet.
            </div>
          ) : (
            <div className="mt-3 flex flex-wrap gap-3">
              {tags.map(
                (tag) => {
                  const selected =
                    selectedTagIds.includes(
                      tag.id,
                    );

                  return (
                    <button
                      key={
                        tag.id
                      }
                      type="button"
                      onClick={() =>
                        toggleTag(
                          tag.id,
                        )
                      }
                      disabled={
                        submitting !==
                        null
                      }
                      className={`rounded-full border px-4 py-2 text-sm font-medium transition ${
                        selected
                          ? "border-green-400/30 bg-green-400/10 text-green-300"
                          : "border-white/10 bg-black/10 text-gray-400 hover:border-green-400/30 hover:text-white"
                      }`}
                    >
                      {selected
                        ? "✓ "
                        : ""}
                      {
                        tag.name
                      }
                    </button>
                  );
                },
              )}
            </div>
          )}
        </div>

        {/* COVER IMAGE */}

        <div>
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div>
              <p className="text-sm font-medium text-gray-300">
                Cover Image
              </p>

              <p className="mt-1 text-xs text-gray-500">
                JPG, PNG, or WebP.
                Maximum size 5 MB.
              </p>
            </div>

            {coverImageUrl && (
              <button
                type="button"
                onClick={() => {
                  setCoverImageUrl(
                    "",
                  );

                  setCoverImageAlt(
                    "",
                  );
                }}
                disabled={
                  submitting !==
                    null ||
                  uploadingImage
                }
                className="text-sm font-medium text-red-300 transition hover:text-red-200"
              >
                Remove image
              </button>
            )}
          </div>

          <label className="mt-4 flex cursor-pointer items-center justify-center gap-3 rounded-2xl border border-dashed border-white/15 bg-black/10 px-6 py-8 text-center transition hover:border-green-400/40 hover:bg-green-400/5">
            <input
              type="file"
              accept="image/jpeg,image/png,image/webp"
              onChange={
                uploadCoverImage
              }
              disabled={
                submitting !==
                  null ||
                uploadingImage
              }
              className="hidden"
            />

            <ImagePlus
              size={22}
              className="text-green-300"
            />

            <span className="text-sm font-medium text-gray-300">
              {uploadingImage
                ? "Uploading image..."
                : coverImageUrl
                  ? "Choose a different image"
                  : "Choose cover image"}
            </span>
          </label>

          {coverImageUrl && (
            <div className="mt-5 overflow-hidden rounded-2xl border border-white/10 bg-black/10">
              <Image
                src={
                  coverImageUrl
                }
                alt={
                  coverImageAlt ||
                  "Cover image preview"
                }
                width={1200}
                height={675}
                sizes="(min-width: 1024px) 800px, 100vw"
                className="aspect-[16/9] w-full object-cover"
              />
            </div>
          )}

          {coverImageUrl && (
            <label className="mt-5 block text-sm font-medium text-gray-300">
              Cover image alt text

              <input
                type="text"
                value={
                  coverImageAlt
                }
                onChange={(
                  event,
                ) =>
                  setCoverImageAlt(
                    event.target
                      .value,
                  )
                }
                maxLength={250}
                disabled={
                  submitting !==
                    null ||
                  uploadingImage
                }
                className={
                  inputStyles
                }
                placeholder="Describe the image for accessibility"
              />

              <p className="mt-2 text-right text-xs text-gray-500">
                {
                  coverImageAlt.length
                }
                /250
              </p>
            </label>
          )}
        </div>

        {/* MARKDOWN EDITOR */}

        <div>
          <div className="mb-4 flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="text-sm font-medium text-gray-300">
                Article Content
              </p>

              <p className="mt-1 text-xs text-gray-500">
                Markdown formatting
                is supported.
              </p>
            </div>

            <div className="flex rounded-xl border border-white/10 bg-black/10 p-1">
              <button
                type="button"
                onClick={() =>
                  setEditorMode(
                    "write",
                  )
                }
                className={`inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition ${
                  editorMode ===
                  "write"
                    ? "bg-green-400/10 text-green-300"
                    : "text-gray-400 hover:text-white"
                }`}
              >
                <FileText
                  size={16}
                />
                Write
              </button>

              <button
                type="button"
                onClick={() =>
                  setEditorMode(
                    "preview",
                  )
                }
                className={`inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition ${
                  editorMode ===
                  "preview"
                    ? "bg-green-400/10 text-green-300"
                    : "text-gray-400 hover:text-white"
                }`}
              >
                <Eye
                  size={16}
                />
                Preview
              </button>
            </div>
          </div>

          {editorMode ===
          "write" ? (
            <div>
              <textarea
                value={
                  content
                }
                onChange={(
                  event,
                ) =>
                  setContent(
                    event.target
                      .value,
                  )
                }
                rows={22}
                className={`${inputStyles} resize-y font-mono leading-7`}
                placeholder={`# Article heading

Write your introduction here.

## Section heading

Add paragraphs, **bold text**, *italic text*, links, lists, quotes, and code.

### Example code

\`\`\`bash
nmap -sV 192.168.1.10
\`\`\`

> Add useful notes here.
`}
                disabled={
                  submitting !==
                  null
                }
                required
              />
            </div>
          ) : (
            <div className="min-h-[500px] rounded-2xl border border-white/10 bg-black/10 p-6 md:p-8">
              {content.trim() ? (
                <MarkdownRenderer
                  content={
                    content
                  }
                />
              ) : (
                <div className="flex min-h-[400px] items-center justify-center">
                  <div className="text-center">
                    <FileImage
                      size={30}
                      className="mx-auto text-gray-600"
                    />

                    <p className="mt-4 text-gray-500">
                      Nothing to
                      preview yet.
                    </p>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* FEATURED */}

              {isAdmin && (
        <label className="flex w-fit cursor-pointer items-center gap-3 rounded-xl border border-white/10 bg-black/10 px-4 py-3 text-sm text-gray-300 transition hover:border-green-400/30">
          <input
            type="checkbox"
            checked={
              featured
            }
            onChange={(
              event,
            ) =>
              setFeatured(
                event.target
                  .checked,
              )
            }
            className="h-4 w-4 accent-green-400"
            disabled={
              submitting !==
              null
            }
          />

          Feature this article
        </label>
      )}

        {/* ERROR */}

        {error && (
          <p
            role="alert"
            className="rounded-xl border border-red-400/20 bg-red-400/10 px-4 py-3 text-sm text-red-300"
          >
            {error}
          </p>
        )}

        {/* ACTIONS */}

        <div className="flex flex-wrap gap-4 border-t border-white/10 pt-6">
          <button
            type="submit"
            disabled={
              submitting !==
                null ||
              uploadingImage
            }
            className="inline-flex items-center gap-2 rounded-xl border border-white/15 px-5 py-3 font-medium text-white transition hover:border-green-400 hover:text-green-300 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <Save
              size={18}
            />

            {submitting ===
            "draft"
              ? "Saving..."
              : isEditing
                ? "Save as Draft"
                : "Save Draft"}
          </button>

          <button
            type="button"
            disabled={
              submitting !==
                null ||
              uploadingImage
            }
            onClick={() => {
              void savePost(
                "published",
              );
            }}
            className="inline-flex items-center gap-2 rounded-xl bg-green-500 px-5 py-3 font-medium text-black transition hover:bg-green-400 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <Send
              size={18}
            />

            {submitting ===
            "publish"
              ? "Publishing..."
              : isEditing
                ? "Save & Publish"
                : "Publish"}
          </button>

          {isEditing && (
            <>
              <button
                type="button"
                disabled={
                  submitting !==
                  null
                }
                onClick={() =>
                  setConfirmAction(
                    "archive",
                  )
                }
                className="inline-flex items-center gap-2 rounded-xl border border-amber-400/20 px-5 py-3 font-medium text-amber-300 transition hover:bg-amber-400/10 disabled:cursor-not-allowed disabled:opacity-60"
              >
                <Archive
                  size={18}
                />
                Archive
              </button>

              <button
                type="button"
                disabled={
                  submitting !==
                  null
                }
                onClick={() =>
                  setConfirmAction(
                    "delete",
                  )
                }
                className="inline-flex items-center gap-2 rounded-xl border border-red-400/20 px-5 py-3 font-medium text-red-300 transition hover:bg-red-400/10 disabled:cursor-not-allowed disabled:opacity-60"
              >
                <Trash2
                  size={18}
                />
                Delete
              </button>
            </>
          )}
        </div>
      </form>

      {/* CUSTOM CONFIRMATION MODAL */}

      {confirmAction && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 px-6 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
          aria-labelledby="confirmation-title"
          onMouseDown={(
            event,
          ) => {
            if (
              event.target ===
              event.currentTarget
            ) {
              closeConfirmation();
            }
          }}
        >
          <div className="relative w-full max-w-md rounded-3xl border border-white/10 bg-[#102A2A] p-6 shadow-2xl md:p-8">
            <button
              type="button"
              onClick={
                closeConfirmation
              }
              disabled={
                submitting ===
                  "archive" ||
                submitting ===
                  "delete"
              }
              className="absolute right-5 top-5 inline-flex h-9 w-9 items-center justify-center rounded-lg text-gray-400 transition hover:bg-white/5 hover:text-white disabled:cursor-not-allowed disabled:opacity-40"
              aria-label="Close confirmation"
            >
              <X size={20} />
            </button>

            <div
              className={`inline-flex h-12 w-12 items-center justify-center rounded-xl ${
                confirmAction ===
                "delete"
                  ? "bg-red-400/10 text-red-300"
                  : "bg-amber-400/10 text-amber-300"
              }`}
            >
              <TriangleAlert
                size={24}
              />
            </div>

            <p className="mt-6 text-sm font-medium uppercase tracking-[0.2em] text-green-400">
              Confirm Action
            </p>

            <h2
              id="confirmation-title"
              className="mt-3 pr-8 text-2xl font-bold text-white"
            >
              {confirmAction ===
              "delete"
                ? "Delete this post?"
                : "Archive this post?"}
            </h2>

            <p className="mt-4 leading-7 text-gray-400">
              {confirmAction ===
              "delete"
                ? "This will permanently remove the article and its associated data. This action cannot be undone."
                : "This article will be removed from the public blog but kept safely in your database. You can publish it again later."}
            </p>

            <div className="mt-6 rounded-xl border border-white/10 bg-black/10 p-4">
              <p className="text-xs uppercase tracking-wider text-gray-500">
                Article
              </p>

              <p className="mt-2 font-medium text-white">
                {post?.title}
              </p>
            </div>

            <div className="mt-7 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={
                  closeConfirmation
                }
                disabled={
                  submitting ===
                    "archive" ||
                  submitting ===
                    "delete"
                }
                className="rounded-xl border border-white/10 px-5 py-3 text-sm font-medium text-gray-300 transition hover:border-white/20 hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
              >
                Cancel
              </button>

              <button
                type="button"
                disabled={
                  submitting !==
                  null
                }
                onClick={() => {
                  if (
                    confirmAction ===
                    "delete"
                  ) {
                    void deletePost();
                  } else {
                    void archivePost();
                  }
                }}
                className={`inline-flex items-center justify-center gap-2 rounded-xl px-5 py-3 text-sm font-medium transition disabled:cursor-not-allowed disabled:opacity-60 ${
                  confirmAction ===
                  "delete"
                    ? "bg-red-500 text-white hover:bg-red-400"
                    : "bg-amber-400 text-black hover:bg-amber-300"
                }`}
              >
                {confirmAction ===
                "delete" ? (
                  <Trash2
                    size={17}
                  />
                ) : (
                  <Archive
                    size={17}
                  />
                )}

                {submitting ===
                "delete"
                  ? "Deleting..."
                  : submitting ===
                      "archive"
                    ? "Archiving..."
                    : confirmAction ===
                        "delete"
                      ? "Delete Permanently"
                      : "Archive Post"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}