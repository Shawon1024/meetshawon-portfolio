import type { MetadataRoute } from "next";

import { createClient } from "./lib/supabase/server";

export default async function sitemap(): Promise<
  MetadataRoute.Sitemap
> {
  const siteUrl =
    process.env.NEXT_PUBLIC_SITE_URL ??
    "http://localhost:3000";

  // --------------------------------------------------
  // STATIC PAGES
  // --------------------------------------------------

  const staticPages: MetadataRoute.Sitemap = [
    {
      url: siteUrl,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${siteUrl}/about`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${siteUrl}/projects`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${siteUrl}/blog`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${siteUrl}/contact`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.6,
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
    .from("posts")
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
        ascending: false,
      },
    );

  if (error) {
    console.error(
      "Sitemap posts query failed:",
      error,
    );
  }

  const blogPages: MetadataRoute.Sitemap =
    (posts ?? []).map(
      (post) => ({
        url: `${siteUrl}/blog/${post.slug}`,

        lastModified:
          post.updated_at ??
          post.published_at ??
          new Date(),

        changeFrequency:
          "monthly",

        priority: 0.7,
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