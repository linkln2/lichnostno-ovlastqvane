import type { MetadataRoute } from "next";

const BASE_URL = "https://lichnostno-ovlastqvane.vercel.app";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/admin", "/dashboard", "/api", "/checkin"],
      },
    ],
    sitemap: `${BASE_URL}/sitemap.xml`,
  };
}
