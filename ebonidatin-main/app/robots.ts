import type { MetadataRoute } from "next"

export default function robots(): MetadataRoute.Robots {
  const baseUrl = "https://ebonidating.com"

  return {
    rules: [
      {
        userAgent: "*",
        allow: ["/", "/auth/login", "/auth/sign-up"],
        disallow: ["/admin/", "/api/", "/dashboard/", "/discover/", "/matches/", "/messages/", "/profile/"],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  }
}
