import type {
  MetadataRoute,
} from "next";

import {
  createClient,
} from "./lib/supabase/server";

const STATIC_LAST_MODIFIED =
  new Date("2026-08-24");

export default async function sitemap(): Promise<
  MetadataRoute.Sitemap
> {
  const siteUrl = (
    process.env
      .NEXT_PUBLIC_SITE_URL ??
    "http://localhost:3000"
  ).replace(
    /\/+$/,
    "",
  );

  // --------------------------------------------------
  // STATIC PAGES
  // --------------------------------------------------

  const staticPages:
    MetadataRoute.Sitemap = [
    {
      url:
        siteUrl,

      lastModified:
        STATIC_LAST_MODIFIED,

      changeFrequency:
        "weekly",

      priority:
        1,
    },

    {
      url:
        `${siteUrl}/about`,

      lastModified:
        STATIC_LAST_MODIFIED,

      changeFrequency:
        "monthly",

      priority:
        0.8,
    },

    {
      url:
        `${siteUrl}/projects`,

      lastModified:
        STATIC_LAST_MODIFIED,

      changeFrequency:
        "weekly",

      priority:
        0.9,
    },

    {
      url:
        `${siteUrl}/skills`,

      lastModified:
        STATIC_LAST_MODIFIED,

      changeFrequency:
        "monthly",

      priority:
        0.8,
    },

    {
      url:
        `${siteUrl}/certifications`,

      lastModified:
        STATIC_LAST_MODIFIED,

      changeFrequency:
        "monthly",

      priority:
        0.7,
    },

    {
      url:
        `${siteUrl}/resume`,

      lastModified:
        STATIC_LAST_MODIFIED,

      changeFrequency:
        "monthly",

      priority:
        0.8,
    },

    {
      url:
        `${siteUrl}/blog`,

      lastModified:
        STATIC_LAST_MODIFIED,

      changeFrequency:
        "daily",

      priority:
        0.9,
    },

    {
      url:
        `${siteUrl}/contact`,

      lastModified:
        STATIC_LAST_MODIFIED,

      changeFrequency:
        "monthly",

      priority:
        0.6,
    },

    {
      url:
        `${siteUrl}/privacy`,

      lastModified:
        STATIC_LAST_MODIFIED,

      changeFrequency:
        "yearly",

      priority:
        0.3,
    },

        {
      url:
        `${siteUrl}/terms`,

      lastModified:
        STATIC_LAST_MODIFIED,

      changeFrequency:
        "yearly",

      priority:
        0.3,
    },
  ];

  // --------------------------------------------------
  // SUPABASE
  // --------------------------------------------------

  const supabase =
    await createClient();

  const now =
    new Date().toISOString();

  // --------------------------------------------------
  // PUBLISHED BLOG POSTS
  // --------------------------------------------------

  const {
    data: posts,
    error,
  } = await supabase
    .from(
      "posts",
    )
    .select(`
      slug,
      published_at,
      updated_at
    `)
    .eq(
      "status",
      "published",
    )
    .lte(
      "published_at",
      now,
    )
    .order(
      "published_at",
      {
        ascending:
          false,
      },
    );

  if (error) {
    console.error(
      "Sitemap posts query failed:",
      error,
    );
  }

  const blogPages:
    MetadataRoute.Sitemap = (
    posts ??
    []
  ).map(
    (
      post,
    ) => ({
      url:
        `${siteUrl}/blog/${post.slug}`,

      lastModified:
        post.updated_at ??
        post.published_at ??
        STATIC_LAST_MODIFIED,

      changeFrequency:
        "monthly",

      priority:
        0.7,
    }),
  );

  // --------------------------------------------------
  // FINAL SITEMAP
  // --------------------------------------------------

  return [
    ...staticPages,
    ...blogPages,
  ];
}