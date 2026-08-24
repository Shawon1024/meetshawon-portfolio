import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";
import BookmarkButton from "../../components/blog/BookmarkButton";
import RoleBadge from "../../components/ui/RoleBadge";
import {
  ArrowLeft,
  CalendarDays,
  Clock3,
  UserRound,
} from "lucide-react";
import { notFound } from "next/navigation";
import ArticleShare from "../../components/blog/ArticleShare";
import ArticleCoverImage from "../../components/blog/ArticleCoverImage";
import MarkdownRenderer from "../../components/blog/MarkdownRenderer";
import RelatedArticles from "../../components/blog/RelatedArticles";
import PostComments from "../../components/blog/PostComments";
import PostReactions from "../../components/blog/PostReactions";
import Container from "../../components/Container";
import VerifiedBadge from "../../components/ui/VerifiedBadge";
import { createClient } from "../../lib/supabase/server";
import ArticleViewCounter from "../../components/blog/ArticleViewCounter";

interface BlogPostPageProps {
  params: Promise<{
    slug: string;
  }>;
}

function formatDate(
  date: string | null,
) {
  if (!date) {
    return "";
  }

  return new Intl.DateTimeFormat(
    "en-GB",
    {
      day: "numeric",
      month: "long",
      year: "numeric",
    },
  ).format(
    new Date(date),
  );
}

function estimateReadingTime(
  content: string,
) {
  const words = content
    .trim()
    .split(/\s+/)
    .filter(Boolean).length;

  const minutes = Math.max(
    1,
    Math.ceil(
      words / 220,
    ),
  );

  return `${minutes} min read`;
}

export async function generateMetadata({
  params,
}: BlogPostPageProps): Promise<Metadata> {
  const { slug } = await params;

  const supabase =
    await createClient();

  const {
    data: post,
  } = await supabase
    .from("posts")
    .select(`
      title,
      slug,
      excerpt,
      content,
      published_at,
      cover_image_url,
      cover_image_alt,
      view_count
    `)
    .eq("slug", slug)
    .eq("status", "published")
    .lte(
      "published_at",
      new Date().toISOString(),
    )
    .maybeSingle();

  if (!post) {
    return {
      title: "Article Not Found",
    };
  }

  const description =
    post.excerpt?.trim() ||
    post.content
      .replace(/[#>*_`~-]/g, "")
      .replace(/\s+/g, " ")
      .trim()
      .slice(0, 160);

  const canonicalUrl =
    `/blog/${post.slug}`;

  return {
    title:
      post.title,

    description,

    alternates: {
      canonical: canonicalUrl,
    },

    openGraph: {
      type: "article",

      title: post.title,

      description,

      url: canonicalUrl,

      publishedTime:
        post.published_at ??
        undefined,

      images: [
  {
    url:
      post.cover_image_url ||
      "/opengraph-image.png",

    width:
      post.cover_image_url
        ? undefined
        : 1200,

    height:
      post.cover_image_url
        ? undefined
        : 630,

    alt:
      post.cover_image_url
        ? post.cover_image_alt ??
          post.title
        : `${post.title} — Meet Shawon`,
  },
],
    },

    twitter: {
     card:
      "summary_large_image",

      title: post.title,

      description,

      images: [
        post.cover_image_url ||
          "/opengraph-image.png",
      ],
    },
  };
}

export default async function BlogPostPage({
  params,
}: BlogPostPageProps) {
  const { slug } =
    await params;

  const supabase =
    await createClient();

  // --------------------------------------------------
  // LOAD ARTICLE
  // --------------------------------------------------

  const {
    data: post,
    error,
  } = await supabase
    .from("posts")
    .select(`
      id,
      author_id,
      title,
      slug,
      excerpt,
      content,
      featured,
      published_at,
      category_id,
      cover_image_url,
      cover_image_alt,
      view_count,
      category:categories (
        id,
        name,
        slug
      ),
      post_tags (
        tag:tags (
          id,
          name,
          slug
        )
      )
    `)
    .eq(
      "slug",
      slug,
    )
    .eq(
      "status",
      "published",
    )
    .lte(
      "published_at",
      new Date().toISOString(),
    )
    .single();

  if (error || !post) {
    notFound();
  }

  // --------------------------------------------------
// RELATED ARTICLES
// --------------------------------------------------

let relatedPostsQuery = supabase
  .from("posts")
  .select(`
    id,
    title,
    slug,
    excerpt,
    published_at,
    cover_image_url,
    cover_image_alt
  `)
  .eq(
    "status",
    "published",
  )
  .neq(
    "id",
    post.id,
  )
  .lte(
    "published_at",
    new Date().toISOString(),
  )
  .order(
    "published_at",
    {
      ascending: false,
    },
  )
  .limit(3);

if (post.category_id) {
  relatedPostsQuery =
    relatedPostsQuery.eq(
      "category_id",
      post.category_id,
    );
}

const {
  data: relatedPosts,
} = await relatedPostsQuery;

// --------------------------------------------------
// PREVIOUS ARTICLE
// --------------------------------------------------

const {
  data: previousPost,
} = await supabase
  .from("posts")
  .select(`
    title,
    slug
  `)
  .eq(
    "status",
    "published",
  )
  .lt(
    "published_at",
    post.published_at,
  )
  .order(
    "published_at",
    {
      ascending: false,
    },
  )
  .limit(1)
  .maybeSingle();

// --------------------------------------------------
// NEXT ARTICLE
// --------------------------------------------------

const {
  data: nextPost,
} = await supabase
  .from("posts")
  .select(`
    title,
    slug
  `)
  .eq(
    "status",
    "published",
  )
  .gt(
    "published_at",
    post.published_at,
  )
  .lte(
    "published_at",
    new Date().toISOString(),
  )
  .order(
    "published_at",
    {
      ascending: true,
    },
  )
  .limit(1)
  .maybeSingle();

  // --------------------------------------------------
  // LOAD AUTHOR
  // --------------------------------------------------

  const {
    data: author,
  } = await supabase
    .from("profiles")
    .select(`
      id,
      first_name,
      last_name,
      username,
      avatar_url,
      verified,
      role
    `)
    .eq(
      "id",
      post.author_id,
    )
    .single();

  const authorFullName =
    [
      author?.first_name,
      author?.last_name,
    ]
      .filter(Boolean)
      .join(" ")
      .trim() ||
    author?.username ||
    "Md Samsudduha Shawon";

  // --------------------------------------------------
  // CATEGORY
  // --------------------------------------------------

  const category =
    Array.isArray(
      post.category,
    )
      ? post.category[0]
      : post.category;

  // --------------------------------------------------
  // TAGS
  // --------------------------------------------------

  const tags =
    post.post_tags
      ?.map((item) =>
        Array.isArray(
          item.tag,
        )
          ? item.tag[0]
          : item.tag,
      )
      .filter(Boolean) ??
    [];

    const articleStructuredData = {
  "@context":
    "https://schema.org",

  "@type":
    "Article",

  headline:
    post.title,

  description:
    post.excerpt ??
    undefined,

  datePublished:
    post.published_at ??
    undefined,

  image:
    post.cover_image_url
      ? [
          post.cover_image_url,
        ]
      : undefined,

  author: {
    "@type":
      "Person",

    name:
      authorFullName,
  },

  publisher: {
    "@type":
      "Person",

    name:
      authorFullName,
  },

  mainEntityOfPage: {
    "@type":
      "WebPage",

    "@id":
      `${
        process.env
          .NEXT_PUBLIC_SITE_URL ??
        "http://localhost:3000"
      }/blog/${post.slug}`,
  },
};

  return (
    <main>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            articleStructuredData,
          ).replace(/</g, "\\u003c"),
        }}
      />
      {/* =================================================
          ARTICLE HEADER
      ================================================= */}

      <section className="px-6 pb-12 pt-16 md:pt-24">
        <div className="mx-auto max-w-4xl">
          {/* Back */}

          <Link
            href="/blog"
            className="inline-flex items-center gap-2 text-sm text-gray-400 transition hover:text-green-400"
          >
            <ArrowLeft
              size={16}
            />

            Back to Blog
          </Link>

          <div className="mt-10">
            {/* Category / Featured */}

            <div className="flex flex-wrap items-center gap-2">
              {category && (
                <Link
                  href={`/blog?category=${category.slug}`}
                  className="rounded-full border border-green-400/20 bg-green-400/10 px-3 py-1 text-xs font-medium text-green-300 transition hover:bg-green-400/20"
                >
                  {
                    category.name
                  }
                </Link>
              )}

              {post.featured && (
                <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-medium uppercase tracking-wider text-gray-400">
                  Featured
                </span>
              )}
            </div>

            {/* Title */}

            <h1 className="mt-6 text-4xl font-bold leading-tight text-white md:text-5xl lg:text-6xl">
              {post.title}
            </h1>

            {/* Excerpt */}

            {post.excerpt && (
              <p className="mt-6 max-w-3xl text-lg leading-8 text-gray-300">
                {
                  post.excerpt
                }
              </p>
            )}

            {/* =========================================
                AUTHOR
            ========================================= */}

            <div className="mt-8 flex items-center gap-3">
              {author
                ?.avatar_url ? (
                <Image
                  src={
                    author.avatar_url
                  }
                  alt={
                    authorFullName
                  }
                  width={44}
                  height={44}
                  sizes="44px"
                  className="h-11 w-11 rounded-full border border-white/10 object-cover"
                />
              ) : (
                <div className="flex h-11 w-11 items-center justify-center rounded-full border border-white/10 bg-green-400/10 text-green-300">
                  <UserRound
                    size={20}
                  />
                </div>
              )}

              <div>
                <p className="text-xs uppercase tracking-wider text-gray-500">
                  Written by
                </p>

                <div className="mt-1">
                  <div className="flex items-center gap-1.5">
                    {author?.username ? (
                      <Link href={`/u/${author.username}`}
                      className="font-medium text-white transition hover:text-green-300">
                        {authorFullName}
                      </Link>
                    ) : (
                      <p className="font-medium text-white">
                        {authorFullName}
                      </p>
                    )}

                  {author?.verified && (
                    <VerifiedBadge
                      size={18}
                    />
                  )}
                  <RoleBadge
  role={author?.role}
  showUser={false}
/>
                  </div>
                  {author?.username && (
                    <Link href={`/u/${author.username}`}
                    className="mt-1 block w-fit text-xs text-gray-500 transition hover:text-green-400">
                      @{author.username}
                    </Link>
                  )}
                </div>
              </div>
            </div>

            {/* Date / reading time */}

<div className="mt-7 flex flex-wrap items-center gap-5 text-sm text-gray-500">
  <span className="inline-flex items-center gap-2">
    <CalendarDays size={15} />

    {formatDate(
      post.published_at,
    )}
  </span>

  <span className="inline-flex items-center gap-2">
    <Clock3 size={15} />

    {estimateReadingTime(
      post.content,
    )}
  </span>

  <ArticleViewCounter
    postId={post.id}
    initialViews={
      Number(
        post.view_count ??
          0,
      )
    }
  />
</div>

            {/* Tags */}

            {tags.length > 0 && (
              <div className="mt-6 flex flex-wrap gap-2">
                {tags.map(
                  (tag) => (
                    <Link
                      key={
                        tag.id
                      }
                      href={`/blog?tag=${tag.slug}`}
                      className="rounded-full border border-white/10 bg-black/10 px-3 py-1 text-sm text-gray-400 transition hover:border-green-400/30 hover:text-green-300"
                    >
                      #
                      {
                        tag.name
                      }
                    </Link>
                  ),
                )}
              </div>
            )}
            {/* Save article */}

<div className="mt-7">
  <BookmarkButton
    postId={post.id}
  />
</div>
          </div>
        </div>
      </section>

      {/* =================================================
          COVER IMAGE
      ================================================= */}

      {post.cover_image_url && (
        <section className="px-6 pb-12">
          <ArticleCoverImage
            src={
              post.cover_image_url
            }
            alt={
              post.cover_image_alt ??
              post.title
            }
          />
        </section>
      )}

      {/* =================================================
          ARTICLE CONTENT
      ================================================= */}

      <section className="border-t border-white/5 py-16">
        <Container>
          <article className="mx-auto max-w-4xl">
            <MarkdownRenderer
              content={
                post.content
              }
            />

            {/* Share */}

<div className="mt-14">
  <ArticleShare
    title={post.title}
    slug={post.slug}
  />
</div>

            {/* Reactions */}

            <div className="mt-14">
              <PostReactions
                postId={
                  post.id
                }
              />
            </div>

            {/* Comments */}

            <div className="mt-8">
              <PostComments
                postId={
                  post.id
                }
              />
            </div>
          </article>
        </Container>
      </section>
      <section className="border-t border-white/5 py-16">
  <Container>
    <div className="mx-auto max-w-5xl">
      <RelatedArticles
        relatedPosts={
          relatedPosts ?? []
        }
        previousPost={
          previousPost
        }
        nextPost={
          nextPost
        }
      />
    </div>
  </Container>
</section>
    </main>
  );
}