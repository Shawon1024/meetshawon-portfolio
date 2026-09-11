"use client";

import {
  type ChangeEvent,
  type KeyboardEvent,
  type ReactNode,
  useRef,
  useState,
} from "react";
import { useRouter } from "next/navigation";
import {
  Archive,
  Bold,
  Code2,
  Eye,
  FileImage,
  FileText,
  Heading2,
  Heading3,
  ImagePlus,
  Italic,
  Link2,
  List,
  ListOrdered,
  Quote,
  Save,
  Send,
  Strikethrough,
  Trash2,
  TriangleAlert,
  Underline,
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

interface ToolbarButtonProps {
  label: string;
  onClick: () => void;
  children: ReactNode;
  disabled?: boolean;
}

function ToolbarButton({
  label,
  onClick,
  children,
  disabled = false,
}: ToolbarButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={label}
      className="group relative inline-flex h-9 w-9 items-center justify-center rounded-lg text-gray-300 transition hover:bg-green-400/10 hover:text-green-300 focus-visible:bg-green-400/10 focus-visible:text-green-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-300 disabled:cursor-not-allowed disabled:opacity-40"
    >
      {children}

      <span
        role="tooltip"
        className="pointer-events-none absolute bottom-full left-1/2 z-30 mb-2 -translate-x-1/2 whitespace-nowrap rounded-lg border border-white/10 bg-[#071411] px-2.5 py-1.5 text-xs font-medium text-white opacity-0 shadow-xl transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100"
      >
        {label}
      </span>
    </button>
  );
}

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

  const studioBasePath =
    currentRole ===
    "moderator"
      ? "/moderator/posts"
      : currentRole ===
          "author"
        ? "/author/posts"
        : "/admin/posts";

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

  const [uploadingInlineImage, setUploadingInlineImage] =
    useState(false);

  const [showInlineImagePanel, setShowInlineImagePanel] =
    useState(false);

  const [inlineImageAlt, setInlineImageAlt] =
    useState("");

  const [inlineImageCaption, setInlineImageCaption] =
    useState("");

  const contentTextareaRef =
    useRef<HTMLTextAreaElement>(null);

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

  const replaceContentSelection = (
    replacement: string,
    selectionStart: number,
    selectionEnd: number,
  ) => {
    const nextContent =
      content.slice(
        0,
        selectionStart,
      ) +
      replacement +
      content.slice(
        selectionEnd,
      );

    setContent(nextContent);

    requestAnimationFrame(
      () => {
        const textarea =
          contentTextareaRef.current;

        if (!textarea) {
          return;
        }

        const nextCursor =
          selectionStart +
          replacement.length;

        textarea.focus();
        textarea.setSelectionRange(
          nextCursor,
          nextCursor,
        );
      },
    );
  };

  const insertWrappedText = (
    opening: string,
    closing: string,
    placeholder: string,
  ) => {
    const textarea =
      contentTextareaRef.current;

    if (!textarea) {
      return;
    }

    const start =
      textarea.selectionStart;
    const end =
      textarea.selectionEnd;
    const selectedText =
      content.slice(
        start,
        end,
      ) || placeholder;
    const replacement =
      `${opening}${selectedText}${closing}`;

    replaceContentSelection(
      replacement,
      start,
      end,
    );

    requestAnimationFrame(
      () => {
        const currentTextarea =
          contentTextareaRef.current;

        if (!currentTextarea) {
          return;
        }

        const selectionStart =
          start + opening.length;

        currentTextarea.setSelectionRange(
          selectionStart,
          selectionStart +
            selectedText.length,
        );
      },
    );
  };

  const insertBlock = (
    before: string,
    placeholder: string,
    after = "",
  ) => {
    const textarea =
      contentTextareaRef.current;

    if (!textarea) {
      return;
    }

    const start =
      textarea.selectionStart;
    const end =
      textarea.selectionEnd;
    const selectedText =
      content.slice(
        start,
        end,
      ) || placeholder;
    const needsLeadingBreak =
      start > 0 &&
      content[start - 1] !== "\n";
    const needsTrailingBreak =
      end < content.length &&
      content[end] !== "\n";
    const replacement = `${
      needsLeadingBreak ? "\n\n" : ""
    }${before}${selectedText}${after}${
      needsTrailingBreak ? "\n\n" : ""
    }`;

    replaceContentSelection(
      replacement,
      start,
      end,
    );
  };

  const insertLink = () => {
    insertWrappedText(
      "[",
      "](https://example.com)",
      "link text",
    );
  };

  const handleContentKeyDown = (
    event: KeyboardEvent<HTMLTextAreaElement>,
  ) => {
    if (
      !event.metaKey &&
      !event.ctrlKey
    ) {
      return;
    }

    const key =
      event.key.toLowerCase();

    if (key === "b") {
      event.preventDefault();
      insertWrappedText(
        "**",
        "**",
        "bold text",
      );
    } else if (key === "i") {
      event.preventDefault();
      insertWrappedText(
        "*",
        "*",
        "italic text",
      );
    } else if (key === "u") {
      event.preventDefault();
      insertWrappedText(
        "<u>",
        "</u>",
        "underlined text",
      );
    } else if (key === "k") {
      event.preventDefault();
      insertLink();
    }
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

  const uploadInlineImage = async (
    event: ChangeEvent<HTMLInputElement>,
  ) => {
    const file =
      event.target.files?.[0];

    if (!file) {
      return;
    }

    setError("");

    const cleanAltText =
      inlineImageAlt.trim();

    if (!cleanAltText) {
      setError(
        "Add descriptive alt text before uploading an inline image.",
      );

      event.target.value = "";
      return;
    }

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

    if (
      file.size >
      5 * 1024 * 1024
    ) {
      setError(
        "The inline image must be 5 MB or smaller.",
      );

      event.target.value = "";
      return;
    }

    const textarea =
      contentTextareaRef.current;
    const selectionStart =
      textarea?.selectionStart ??
      content.length;
    const selectionEnd =
      textarea?.selectionEnd ??
      content.length;

    try {
      setUploadingInlineImage(
        true,
      );

      const supabase =
        createClient();
      const extension =
        file.name
          .split(".")
          .pop()
          ?.toLowerCase() ??
        "jpg";
      const storagePath =
        `${authorId}/inline/${crypto.randomUUID()}.${extension}`;

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
        !publicUrlData.publicUrl
      ) {
        throw new Error(
          "The image was uploaded, but its public URL could not be created.",
        );
      }

      const caption =
        inlineImageCaption.trim();
      const imageMarkdown =
        `\n\n![${cleanAltText}](${publicUrlData.publicUrl})${
          caption
            ? `\n*${caption}*`
            : ""
        }\n\n`;

      replaceContentSelection(
        imageMarkdown,
        selectionStart,
        selectionEnd,
      );

      setInlineImageAlt("");
      setInlineImageCaption("");
      setShowInlineImagePanel(
        false,
      );
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "The inline image could not be uploaded.",
      );
    } finally {
      setUploadingInlineImage(
        false,
      );

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
        studioBasePath,
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
          studioBasePath,
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
          studioBasePath,
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
        className="grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_320px]"
        onSubmit={(
          event,
        ) => {
          event.preventDefault();

          void savePost(
            "draft",
          );
        }}
      >
        <div className="min-w-0 space-y-6">
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

  {/* MARKDOWN EDITOR */}

          <div className="min-w-0 rounded-2xl border border-white/10 bg-black/5 p-4 md:p-5">
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
                <div className="mb-3 rounded-2xl border border-white/10 bg-black/10 p-3">
                  <div
                    className="flex flex-wrap gap-1"
                    role="toolbar"
                    aria-label="Article formatting"
                  >
                    <ToolbarButton label="Bold (Ctrl/Cmd+B)" onClick={() => insertWrappedText("**", "**", "bold text")} disabled={submitting !== null}>
                      <Bold size={17} />
                    </ToolbarButton>

                    <ToolbarButton label="Italic (Ctrl/Cmd+I)" onClick={() => insertWrappedText("*", "*", "italic text")} disabled={submitting !== null}>
                      <Italic size={17} />
                    </ToolbarButton>

                    <ToolbarButton label="Underline (Ctrl/Cmd+U)" onClick={() => insertWrappedText("<u>", "</u>", "underlined text")} disabled={submitting !== null}>
                      <Underline size={17} />
                    </ToolbarButton>

                    <ToolbarButton label="Strikethrough" onClick={() => insertWrappedText("~~", "~~", "struck text")} disabled={submitting !== null}>
                      <Strikethrough size={17} />
                    </ToolbarButton>

                    <span className="mx-1 h-9 w-px bg-white/10" aria-hidden="true" />

                    <ToolbarButton label="Heading 2" onClick={() => insertBlock("## ", "Section heading")} disabled={submitting !== null}>
                      <Heading2 size={18} />
                    </ToolbarButton>

                    <ToolbarButton label="Heading 3" onClick={() => insertBlock("### ", "Subsection heading")} disabled={submitting !== null}>
                      <Heading3 size={18} />
                    </ToolbarButton>

                    <ToolbarButton label="Bulleted list" onClick={() => insertBlock("- ", "List item")} disabled={submitting !== null}>
                      <List size={18} />
                    </ToolbarButton>

                    <ToolbarButton label="Numbered list" onClick={() => insertBlock("1. ", "List item")} disabled={submitting !== null}>
                      <ListOrdered size={18} />
                    </ToolbarButton>

                    <ToolbarButton label="Blockquote" onClick={() => insertBlock("> ", "Quoted text")} disabled={submitting !== null}>
                      <Quote size={18} />
                    </ToolbarButton>

                    <span className="mx-1 h-9 w-px bg-white/10" aria-hidden="true" />
                  </div>

                  <div className="mt-1 flex flex-wrap gap-1 border-t border-white/10 pt-2">
                    <ToolbarButton label="Insert image" onClick={() => setShowInlineImagePanel((current) => !current)} disabled={submitting !== null || uploadingInlineImage}>
                      <ImagePlus size={18} />
                    </ToolbarButton>

                    <ToolbarButton label="Inline code" onClick={() => insertWrappedText("`", "`", "code")} disabled={submitting !== null}>
                      <Code2 size={18} />
                    </ToolbarButton>

                    <ToolbarButton label="Code block" onClick={() => insertBlock("```text\n", "code", "\n```")} disabled={submitting !== null}>
                      <FileText size={17} />
                    </ToolbarButton>

                    <ToolbarButton label="Insert link (Ctrl/Cmd+K)" onClick={insertLink} disabled={submitting !== null}>
                      <Link2 size={18} />
                    </ToolbarButton>

                    <ToolbarButton label="Insert table" onClick={() => insertBlock("| Column 1 | Column 2 |\n| --- | --- |\n| Value 1 | Value 2 |\n", "")} disabled={submitting !== null}>
                      <span className="text-xs font-bold">Tbl</span>
                    </ToolbarButton>

                    <ToolbarButton label="Horizontal divider" onClick={() => insertBlock("---\n", "")} disabled={submitting !== null}>
                      <span className="text-lg leading-none">—</span>
                    </ToolbarButton>
                  </div>
                </div>

                {showInlineImagePanel && (
                  <div className="mb-3 grid gap-3 rounded-2xl border border-green-400/15 bg-green-400/[0.04] p-4 md:grid-cols-2">
                  <label className="text-xs font-medium text-gray-400">
                    Inline image alt text
                    <input
                      type="text"
                      value={inlineImageAlt}
                      onChange={(event) => setInlineImageAlt(event.target.value)}
                      maxLength={250}
                      className="mt-2 w-full rounded-xl border border-white/10 bg-black/20 px-3 py-2 text-sm text-white outline-none transition placeholder:text-gray-600 focus:border-green-400"
                      placeholder="Describe the image for accessibility"
                      disabled={submitting !== null || uploadingInlineImage}
                    />
                  </label>

                  <label className="text-xs font-medium text-gray-400">
                    Caption (optional)
                    <input
                      type="text"
                      value={inlineImageCaption}
                      onChange={(event) => setInlineImageCaption(event.target.value)}
                      maxLength={250}
                      className="mt-2 w-full rounded-xl border border-white/10 bg-black/20 px-3 py-2 text-sm text-white outline-none transition placeholder:text-gray-600 focus:border-green-400"
                      placeholder="Source, context, or explanatory caption"
                      disabled={submitting !== null || uploadingInlineImage}
                    />
                  </label>

                  <label className="inline-flex cursor-pointer items-center justify-center gap-2 rounded-xl border border-green-400/20 bg-green-400/10 px-4 py-2.5 text-sm font-medium text-green-300 transition hover:border-green-400/40 hover:bg-green-400/15 md:col-span-2">
                    <input
                      type="file"
                      accept="image/jpeg,image/png,image/webp"
                      onChange={uploadInlineImage}
                      disabled={submitting !== null || uploadingInlineImage}
                      className="hidden"
                    />

                    <ImagePlus size={17} />

                    {uploadingInlineImage
                      ? "Uploading and inserting image..."
                      : "Upload Image at Cursor"}
                  </label>
                  </div>
                )}

                <textarea
                  ref={
                    contentTextareaRef
                  }
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
                  onKeyDown={
                    handleContentKeyDown
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

  {/* ERROR */}

          {error && (
            <p
              role="alert"
              className="rounded-xl border border-red-400/20 bg-red-400/10 px-4 py-3 text-sm text-red-300"
            >
              {error}
            </p>
          )}
        </div>

        <aside className="space-y-5">
  {/* ACTIONS */}

          <div className="flex flex-col gap-3 rounded-2xl border border-white/10 bg-black/10 p-5">
            <div>
              <p className="text-sm font-semibold text-white">
                Publishing
              </p>

              <p className="mt-1 text-xs leading-5 text-gray-500">
                Save your work privately or publish it when it is ready.
              </p>
            </div>

            <button
              type="submit"
              disabled={
                submitting !==
                  null ||
                uploadingImage ||
                uploadingInlineImage
              }
              className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-white/15 px-5 py-3 font-medium text-white transition hover:border-green-400 hover:text-green-300 disabled:cursor-not-allowed disabled:opacity-60"
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
                uploadingImage ||
                uploadingInlineImage
              }
              onClick={() => {
                void savePost(
                  "published",
                );
              }}
              className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-green-500 px-5 py-3 font-medium text-black transition hover:bg-green-400 disabled:cursor-not-allowed disabled:opacity-60"
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

            <button
              type="button"
              disabled={
                submitting !==
                  null ||
                uploadingImage ||
                uploadingInlineImage
              }
              onClick={() => {
                router.push(
                  studioBasePath,
                );
              }}
              className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-white/10 px-5 py-3 font-medium text-gray-300 transition hover:border-white/20 hover:bg-white/[0.03] hover:text-white disabled:cursor-not-allowed disabled:opacity-60"
            >
              <X
                size={18}
                aria-hidden="true"
              />

              {isEditing
                ? "Cancel Editing"
                : "Cancel Post"}
            </button>

            {isEditing && (
              <div className="mt-2 space-y-3 border-t border-red-400/15 pt-4">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-red-300">
                    Danger Zone
                  </p>

                  <p className="mt-1 text-xs leading-5 text-gray-500">
                    Archive the article or permanently delete it.
                  </p>
                </div>

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
                  className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-amber-400/20 px-5 py-3 font-medium text-amber-300 transition hover:bg-amber-400/10 disabled:cursor-not-allowed disabled:opacity-60"
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
                  className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-red-400/20 px-5 py-3 font-medium text-red-300 transition hover:bg-red-400/10 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  <Trash2
                    size={18}
                  />
                  Delete
                </button>
              </div>
            )}
          </div>

  {/* CATEGORY */}

          <label className="block rounded-2xl border border-white/10 bg-black/10 p-5 text-sm font-medium text-gray-300">
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

          <div className="rounded-2xl border border-white/10 bg-black/10 p-5">
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

          <div className="rounded-2xl border border-white/10 bg-black/10 p-5">
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

            <label className="mt-4 flex cursor-pointer items-center justify-center gap-3 rounded-xl border border-dashed border-white/15 bg-black/10 px-4 py-5 text-center transition hover:border-green-400/40 hover:bg-green-400/5">
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

  {/* FEATURED */}

          {isAdmin && (
          <label className="flex w-full cursor-pointer items-center gap-3 rounded-2xl border border-white/10 bg-black/10 px-5 py-4 text-sm text-gray-300 transition hover:border-green-400/30">
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
        </aside>
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
