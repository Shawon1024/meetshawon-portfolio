import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  CalendarDays,
  Clock3,
  RotateCcw,
  Search,
} from "lucide-react";
import type { Metadata } from "next";
import Container from "../components/Container";
import { createClient } from "../lib/supabase/server";
import PopularArticles from "../components/blog/PopularArticles";

interface BlogPageProps {
  searchParams: Promise<{
    category?: string;
    tag?: string;
    q?: string;
    page?: string;
  }>;
}

const POSTS_PER_PAGE = 6;

function formatDate(
  date: string | null,
) {
  if (!date) {
    return "Unpublished";
  }

  return new Intl.DateTimeFormat(
    "en-GB",
    {
      day: "numeric",
      month: "short",
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

function buildBlogUrl({
  category,
  tag,
  q,
  page,
}: {
  category?: string;
  tag?: string;
  q?: string;
  page?: number;
}) {
  const params =
    new URLSearchParams();

  if (category) {
    params.set(
      "category",
      category,
    );
  }

  if (tag) {
    params.set(
      "tag",
      tag,
    );
  }

  if (q) {
    params.set(
      "q",
      q,
    );
  }

  if (
    page &&
    page > 1
  ) {
    params.set(
      "page",
      String(page),
    );
  }

  const query =
    params.toString();

  return query
    ? `/blog?${query}`
    : "/blog";
}

export const metadata: Metadata = {
  title:
    "Cybersecurity Blog | Shawon",

  description:
    "Cybersecurity articles, ethical hacking notes, technical projects, infrastructure documentation, and security research.",

  alternates: {
    canonical: "/blog",
  },

  openGraph: {
    title:
      "Cybersecurity Blog | Shawon",

    description:
      "Cybersecurity articles, ethical hacking notes, technical projects, infrastructure documentation, and security research.",

    url:
      "/blog",

    type:
      "website",
  },

  twitter: {
    card:
      "summary",

    title:
      "Cybersecurity Blog | Shawon",

    description:
      "Cybersecurity articles, ethical hacking notes, projects, and technical documentation.",
  },
};

export default async function BlogPage({
  searchParams,
}: BlogPageProps) {
  const params =
    await searchParams;

  const selectedCategory =
    params.category ?? "";

  const selectedTag =
    params.tag ?? "";

  const searchQuery =
    params.q?.trim() ?? "";

  const requestedPage =
    Number.parseInt(
      params.page ?? "1",
      10,
    );

  const currentPage =
    Number.isNaN(
      requestedPage,
    ) ||
    requestedPage < 1
      ? 1
      : requestedPage;

  const supabase =
    await createClient();

  // --------------------------------------------------
// POPULAR ARTICLES
// --------------------------------------------------

const {
  data: popularPosts,
  error: popularPostsError,
} = await supabase
  .from("posts")
  .select(`
    id,
    title,
    slug,
    excerpt,
    view_count,
    cover_image_url,
    cover_image_alt
  `)
  .eq("status", "published")
  .lte(
    "published_at",
    new Date().toISOString(),
  )
  .order("view_count", {
    ascending: false,
  })
  .order("published_at", {
    ascending: false,
  })
  .limit(3);

if (popularPostsError) {
  console.error(
    "Popular articles could not be loaded:",
    popularPostsError,
  );
}

  // --------------------------------------------------
  // LOAD CATEGORIES
  // --------------------------------------------------

  const {
    data: categories,
  } = await supabase
    .from("categories")
    .select(`
      id,
      name,
      slug
    `)
    .order("name", {
      ascending: true,
    });

  // --------------------------------------------------
  // LOAD TAGS
  // --------------------------------------------------

  const {
    data: tags,
  } = await supabase
    .from("tags")
    .select(`
      id,
      name,
      slug
    `)
    .order("name", {
      ascending: true,
    });

  // --------------------------------------------------
  // FIND CATEGORY ID
  // --------------------------------------------------

  const categoryRecord =
    selectedCategory
      ? categories?.find(
          (item) =>
            item.slug ===
            selectedCategory,
        )
      : undefined;

  // --------------------------------------------------
  // LOAD PUBLISHED POSTS
  // --------------------------------------------------

  let query = supabase
    .from("posts")
    .select(
      `
        id,
        title,
        slug,
        excerpt,
        content,
        featured,
        published_at,
        cover_image_url,
        cover_image_alt,
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
      `,
      {
        count: "exact",
      },
    )
    .eq(
      "status",
      "published",
    )
    .lte(
      "published_at",
      new Date().toISOString(),
    );

  // --------------------------------------------------
  // CATEGORY FILTER
  // --------------------------------------------------

  if (categoryRecord) {
    query = query.eq(
      "category_id",
      categoryRecord.id,
    );
  }

  // --------------------------------------------------
  // SEARCH
  // --------------------------------------------------

  if (searchQuery) {
    const safeSearch =
      searchQuery.replace(
        /[%_]/g,
        "",
      );

    query = query.or(
      `title.ilike.%${safeSearch}%,excerpt.ilike.%${safeSearch}%,content.ilike.%${safeSearch}%`,
    );
  }

  // --------------------------------------------------
  // QUERY POSTS
  // --------------------------------------------------

  const {
    data: rawPosts,
    error,
  } = await query
    .order("featured", {
      ascending: false,
    })
    .order(
      "published_at",
      {
        ascending: false,
      },
    );

  // --------------------------------------------------
  // TAG FILTER
  // --------------------------------------------------
  // We apply tag filtering after loading because tags
  // are stored through the post_tags relationship.
  // --------------------------------------------------

  const tagFilteredPosts =
    selectedTag
      ? rawPosts?.filter(
          (post) => {
            const postTags =
              post.post_tags
                ?.map(
                  (item) =>
                    Array.isArray(
                      item.tag,
                    )
                      ? item
                          .tag[0]
                      : item.tag,
                )
                .filter(
                  Boolean,
                ) ?? [];

            return postTags.some(
              (tag) =>
                tag.slug ===
                selectedTag,
            );
          },
        )
      : rawPosts;

  // --------------------------------------------------
  // PAGINATION
  // --------------------------------------------------

  const totalResults =
    tagFilteredPosts?.length ??
    0;

  const totalPages =
    Math.max(
      1,
      Math.ceil(
        totalResults /
          POSTS_PER_PAGE,
      ),
    );

  const safeCurrentPage =
    Math.min(
      currentPage,
      totalPages,
    );

  const startIndex =
    (safeCurrentPage - 1) *
    POSTS_PER_PAGE;

  const paginatedPosts =
    tagFilteredPosts?.slice(
      startIndex,
      startIndex +
        POSTS_PER_PAGE,
    ) ?? [];

  const hasActiveFilters =
    Boolean(
      selectedCategory ||
        selectedTag ||
        searchQuery,
    );

  // --------------------------------------------------
  // PAGE
  // --------------------------------------------------

  return (
    <main>
      {/* =================================================
          HERO + SEARCH
      ================================================= */}

      <section className="px-6 pb-16 pt-16 md:pb-20 md:pt-24">
        <div className="mx-auto max-w-5xl text-center">
          <p className="mb-4 text-sm font-medium uppercase tracking-[0.25em] text-green-400">
            Technical Writing
          </p>

          <h1 className="text-4xl font-bold leading-tight text-white md:text-5xl lg:text-6xl">
            Blog &{" "}
            <span className="text-green-400">
              Documentation
            </span>
          </h1>

          <div className="mx-auto mt-5 h-1 w-16 rounded-full bg-green-400" />

          <p className="mx-auto mt-7 max-w-3xl text-lg leading-8 text-gray-300">
            Cybersecurity learning, infrastructure projects, technical
            documentation, experiments, and reflections from my development
            journey.
          </p>

          {/* Search */}

          <div className="mx-auto mt-9 max-w-3xl">
            <form
              action="/blog"
              method="get"
              className="relative"
            >
              {selectedCategory && (
                <input
                  type="hidden"
                  name="category"
                  value={
                    selectedCategory
                  }
                />
              )}

              {selectedTag && (
                <input
                  type="hidden"
                  name="tag"
                  value={
                    selectedTag
                  }
                />
              )}

              <Search
                size={20}
                className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-gray-500"
              />

              <input
                type="search"
                name="q"
                defaultValue={
                  searchQuery
                }
                placeholder="Search articles..."
                aria-label="Search articles"
                className="w-full rounded-2xl border border-white/10 bg-[var(--surface)]/70 py-4 pl-12 pr-28 text-white shadow-lg shadow-black/10 outline-none transition placeholder:text-gray-500 focus:border-green-400/50"
              />

              <button
                type="submit"
                className="absolute right-2 top-1/2 -translate-y-1/2 rounded-xl bg-green-500 px-5 py-2.5 text-sm font-medium text-black transition hover:bg-green-400"
              >
                Search
              </button>
            </form>

            {searchQuery && (
              <div className="mt-4 flex flex-wrap items-center justify-center gap-2 text-sm text-gray-400">
                <span>
                  Search results for{" "}
                  <span className="font-medium text-white">
                    “{searchQuery}”
                  </span>
                </span>

                <span className="text-gray-600">
                  •
                </span>

                <span>
                  {totalResults}{" "}
                  {totalResults === 1
                    ? "article"
                    : "articles"}{" "}
                  found
                </span>

                <Link
                  href={buildBlogUrl({
                    category:
                      selectedCategory ||
                      undefined,
                    tag:
                      selectedTag ||
                      undefined,
                  })}
                  className="ml-1 font-medium text-green-400 transition hover:text-green-300"
                >
                  Clear search
                </Link>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Popular articles */}

{popularPosts &&
  popularPosts.length > 0 && (
    <section className="border-t border-white/5 py-16">
      <Container>
        <div className="mx-auto max-w-6xl">
          <PopularArticles
            posts={popularPosts}
          />
        </div>
      </Container>
    </section>
  )}

{/* SEARCH */}

      {/* =================================================
          FILTERS
      ================================================= */}

      <section className="border-t border-white/5 py-10">
        <Container>
          <div className="mx-auto max-w-6xl space-y-7">

            {/* =================================================
    ACTIVE FILTERS
================================================= */}

{hasActiveFilters && (
  <div className="rounded-2xl border border-white/10 bg-[var(--surface)]/50 p-5">
    <div className="flex flex-wrap items-center justify-between gap-4">
      <div>
        <p className="text-sm font-medium text-white">
          Active filters
        </p>

        <p className="mt-1 text-sm text-gray-500">
          Remove individual filters or clear everything.
        </p>
      </div>

      <Link
        href="/blog"
        className="inline-flex items-center gap-2 text-sm font-medium text-green-400 transition hover:text-green-300"
      >
        <RotateCcw
          size={15}
        />

        Clear all
      </Link>
    </div>

    <div className="mt-4 flex flex-wrap gap-2">
      {/* Search chip */}

      {searchQuery && (
        <Link
          href={buildBlogUrl({
            category:
              selectedCategory ||
              undefined,
            tag:
              selectedTag ||
              undefined,
          })}
          className="group inline-flex items-center gap-2 rounded-full border border-green-400/20 bg-green-400/10 px-3 py-1.5 text-sm text-green-300 transition hover:border-green-400/40 hover:bg-green-400/15"
        >
          <span>
            Search: “{searchQuery}”
          </span>

          <span className="text-green-300/60 transition group-hover:text-green-200">
            ×
          </span>
        </Link>
      )}

      {/* Category chip */}

      {selectedCategory &&
        categoryRecord && (
          <Link
            href={buildBlogUrl({
              tag:
                selectedTag ||
                undefined,
              q:
                searchQuery ||
                undefined,
            })}
            className="group inline-flex items-center gap-2 rounded-full border border-blue-400/20 bg-blue-400/10 px-3 py-1.5 text-sm text-blue-300 transition hover:border-blue-400/40 hover:bg-blue-400/15"
          >
            <span>
              {categoryRecord.name}
            </span>

            <span className="text-blue-300/60 transition group-hover:text-blue-200">
              ×
            </span>
          </Link>
        )}

      {/* Tag chip */}

      {selectedTag && (
        <>
          {(() => {
            const selectedTagRecord =
              tags?.find(
                (tag) =>
                  tag.slug ===
                  selectedTag,
              );

            if (
              !selectedTagRecord
            ) {
              return null;
            }

            return (
              <Link
                href={buildBlogUrl({
                  category:
                    selectedCategory ||
                    undefined,
                  q:
                    searchQuery ||
                    undefined,
                })}
                className="group inline-flex items-center gap-2 rounded-full border border-purple-400/20 bg-purple-400/10 px-3 py-1.5 text-sm text-purple-300 transition hover:border-purple-400/40 hover:bg-purple-400/15"
              >
                <span>
                  #
                  {
                    selectedTagRecord.name
                  }
                </span>

                <span className="text-purple-300/60 transition group-hover:text-purple-200">
                  ×
                </span>
              </Link>
            );
          })()}
        </>
      )}
    </div>
  </div>
)}

            {/* Category */}

            <div>
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <p className="text-sm font-medium text-white">
                    Filter by category
                  </p>

                  <p className="mt-1 text-sm text-gray-500">
                    Browse articles by main topic.
                  </p>
                </div>

                {hasActiveFilters && (
                  <Link
                    href="/blog"
                    className="inline-flex items-center gap-2 text-sm font-medium text-green-400 transition hover:text-green-300"
                  >
                    <RotateCcw
                      size={15}
                    />

                    Clear filters
                  </Link>
                )}
              </div>

              <div className="mt-4 flex flex-wrap gap-3">
                {categories?.map(
                  (category) => {
                    const active =
                      selectedCategory ===
                      category.slug;

                    return (
                      <Link
                        key={
                          category.id
                        }
                        href={buildBlogUrl({
                          category:
                            category.slug,
                          tag:
                            selectedTag ||
                            undefined,
                          q:
                            searchQuery ||
                            undefined,
                        })}
                        className={`rounded-full border px-4 py-2 text-sm font-medium transition ${
                          active
                            ? "border-green-400/30 bg-green-400/10 text-green-300"
                            : "border-white/10 bg-black/10 text-gray-400 hover:border-green-400/30 hover:text-white"
                        }`}
                      >
                        {
                          category.name
                        }
                      </Link>
                    );
                  },
                )}
              </div>
            </div>

            {/* Tags */}

            <div>
              <p className="text-sm font-medium text-white">
                Filter by tag
              </p>

              <p className="mt-1 text-sm text-gray-500">
                Narrow articles to a specific technology or topic.
              </p>

              <div className="mt-4 flex flex-wrap gap-2">
                {tags?.map(
                  (tag) => {
                    const active =
                      selectedTag ===
                      tag.slug;

                    return (
                      <Link
                        key={
                          tag.id
                        }
                        href={buildBlogUrl({
                          category:
                            selectedCategory ||
                            undefined,
                          tag:
                            tag.slug,
                          q:
                            searchQuery ||
                            undefined,
                        })}
                        className={`rounded-full border px-3 py-1.5 text-xs font-medium transition ${
                          active
                            ? "border-green-400/30 bg-green-400/10 text-green-300"
                            : "border-white/10 bg-black/10 text-gray-400 hover:border-green-400/30 hover:text-white"
                        }`}
                      >
                        #
                        {
                          tag.name
                        }
                      </Link>
                    );
                  },
                )}
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* =================================================
          POSTS
      ================================================= */}

      <section className="border-t border-white/5 py-20">
        <Container>
          <div className="mx-auto max-w-6xl">
            {/* Results summary */}

            {!error &&
              totalResults > 0 && (
                <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
                  <p className="text-sm text-gray-500">
                    Showing{" "}
                    <span className="font-medium text-gray-300">
                      {
                        startIndex +
                        1
                      }
                    </span>
                    –
                    <span className="font-medium text-gray-300">
                      {Math.min(
                        startIndex +
                          POSTS_PER_PAGE,
                        totalResults,
                      )}
                    </span>{" "}
                    of{" "}
                    <span className="font-medium text-gray-300">
                      {
                        totalResults
                      }
                    </span>{" "}
                    articles
                  </p>

                  {totalPages >
                    1 && (
                    <p className="text-sm text-gray-500">
                      Page{" "}
                      {
                        safeCurrentPage
                      }{" "}
                      of{" "}
                      {
                        totalPages
                      }
                    </p>
                  )}
                </div>
              )}

            {error ? (
              <div className="rounded-2xl border border-red-400/20 bg-red-400/10 p-6 text-red-300">
                Blog posts could not be loaded.
              </div>
            ) : paginatedPosts.length ===
              0 ? (
              <div className="rounded-3xl border border-white/10 bg-[var(--surface)]/70 p-10 text-center md:p-14">
                <Search
                  size={30}
                  className="mx-auto text-gray-600"
                />

                <h2 className="mt-5 text-2xl font-semibold text-white">
                  No matching articles
                </h2>

                <p className="mx-auto mt-4 max-w-xl leading-7 text-gray-400">
                  No published articles match your current search or filters.
                </p>

                <Link
                  href="/blog"
                  className="mt-6 inline-flex items-center gap-2 font-medium text-green-400 transition hover:text-green-300"
                >
                  <RotateCcw
                    size={16}
                  />

                  View all articles
                </Link>
              </div>
            ) : (
              <>
                {/* Grid */}

                <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
                  {paginatedPosts.map(
                    (post) => {
                      const category =
                        Array.isArray(
                          post.category,
                        )
                          ? post
                              .category[0]
                          : post.category;

                      const postTags =
                        post.post_tags
                          ?.map(
                            (
                              item,
                            ) =>
                              Array.isArray(
                                item.tag,
                              )
                                ? item
                                    .tag[0]
                                : item.tag,
                          )
                          .filter(
                            Boolean,
                          ) ?? [];

                      return (
                        <article
                          key={
                            post.id
                          }
                          className="group flex h-full flex-col overflow-hidden rounded-2xl border border-white/10 bg-[var(--surface)]/70 p-6 transition hover:-translate-y-1 hover:border-green-400/50"
                        >
                          {/* Cover */}

                          {post.cover_image_url && (
                            <Link
                              href={`/blog/${post.slug}`}
                              className="-mx-6 -mt-6 mb-6 block overflow-hidden"
                            >
                              <img
                                src={
                                  post.cover_image_url
                                }
                                alt={
                                  post.cover_image_alt ??
                                  post.title
                                }
                                className="aspect-[16/9] w-full object-cover transition duration-300 group-hover:scale-[1.02]"
                              />
                            </Link>
                          )}

                          {/* Category */}

                          <div className="flex flex-wrap items-center gap-2">
                            {category && (
                              <Link
                                href={buildBlogUrl({
                                  category:
                                    category.slug,
                                })}
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

                          <h2 className="mt-6 text-2xl font-semibold leading-snug text-white transition group-hover:text-green-300">
                            {
                              post.title
                            }
                          </h2>

                          {/* Excerpt */}

                          <p className="mt-4 line-clamp-4 leading-7 text-gray-400">
                            {post.excerpt ??
                              "Read the full article for technical notes, lessons, and project documentation."}
                          </p>

                          {/* Tags */}

                          {postTags.length >
                            0 && (
                            <div className="mt-5 flex flex-wrap gap-2">
                              {postTags.map(
                                (tag) => (
                                  <Link
                                    key={
                                      tag.id
                                    }
                                    href={buildBlogUrl({
                                      tag:
                                        tag.slug,
                                    })}
                                    className="rounded-full border border-white/10 bg-black/10 px-3 py-1 text-xs text-gray-400 transition hover:border-green-400/30 hover:text-green-300"
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

                          {/* Meta */}

                          <div className="mt-6 flex flex-wrap items-center gap-5 text-sm text-gray-500">
                            <span className="inline-flex items-center gap-2">
                              <CalendarDays
                                size={
                                  15
                                }
                              />

                              {formatDate(
                                post.published_at,
                              )}
                            </span>

                            <span className="inline-flex items-center gap-2">
                              <Clock3
                                size={
                                  15
                                }
                              />

                              {estimateReadingTime(
                                post.content,
                              )}
                            </span>
                          </div>

                          {/* Read */}

                          <div className="mt-auto pt-7">
                            <Link
                              href={`/blog/${post.slug}`}
                              className="inline-flex items-center gap-2 font-medium text-green-400 transition hover:text-green-300"
                            >
                              Read Article

                              <ArrowRight
                                size={
                                  17
                                }
                              />
                            </Link>
                          </div>
                        </article>
                      );
                    },
                  )}
                </div>

                {/* Pagination */}

                {totalPages > 1 && (
                  <nav
                    className="mt-12 flex items-center justify-center gap-3"
                    aria-label="Blog pagination"
                  >
                    {safeCurrentPage >
                      1 ? (
                      <Link
                        href={buildBlogUrl({
                          category:
                            selectedCategory ||
                            undefined,
                          tag:
                            selectedTag ||
                            undefined,
                          q:
                            searchQuery ||
                            undefined,
                          page:
                            safeCurrentPage -
                            1,
                        })}
                        className="inline-flex items-center gap-2 rounded-xl border border-white/10 px-4 py-2.5 text-sm font-medium text-gray-300 transition hover:border-green-400/30 hover:text-green-300"
                      >
                        <ArrowLeft
                          size={16}
                        />
                        Previous
                      </Link>
                    ) : (
                      <span className="inline-flex cursor-not-allowed items-center gap-2 rounded-xl border border-white/5 px-4 py-2.5 text-sm text-gray-700">
                        <ArrowLeft
                          size={16}
                        />
                        Previous
                      </span>
                    )}

                    <div className="hidden items-center gap-2 sm:flex">
                      {Array.from(
                        {
                          length:
                            totalPages,
                        },
                        (
                          _,
                          index,
                        ) =>
                          index +
                          1,
                      ).map(
                        (
                          pageNumber,
                        ) => (
                          <Link
                            key={
                              pageNumber
                            }
                            href={buildBlogUrl({
                              category:
                                selectedCategory ||
                                undefined,
                              tag:
                                selectedTag ||
                                undefined,
                              q:
                                searchQuery ||
                                undefined,
                              page:
                                pageNumber,
                            })}
                            className={`flex h-10 min-w-10 items-center justify-center rounded-xl border px-3 text-sm font-medium transition ${
                              pageNumber ===
                              safeCurrentPage
                                ? "border-green-400/30 bg-green-400/10 text-green-300"
                                : "border-white/10 text-gray-400 hover:border-green-400/30 hover:text-white"
                            }`}
                          >
                            {
                              pageNumber
                            }
                          </Link>
                        ),
                      )}
                    </div>

                    {safeCurrentPage <
                    totalPages ? (
                      <Link
                        href={buildBlogUrl({
                          category:
                            selectedCategory ||
                            undefined,
                          tag:
                            selectedTag ||
                            undefined,
                          q:
                            searchQuery ||
                            undefined,
                          page:
                            safeCurrentPage +
                            1,
                        })}
                        className="inline-flex items-center gap-2 rounded-xl border border-white/10 px-4 py-2.5 text-sm font-medium text-gray-300 transition hover:border-green-400/30 hover:text-green-300"
                      >
                        Next
                        <ArrowRight
                          size={16}
                        />
                      </Link>
                    ) : (
                      <span className="inline-flex cursor-not-allowed items-center gap-2 rounded-xl border border-white/5 px-4 py-2.5 text-sm text-gray-700">
                        Next
                        <ArrowRight
                          size={16}
                        />
                      </span>
                    )}
                  </nav>
                )}
              </>
            )}
          </div>
        </Container>
      </section>
    </main>
  );
}