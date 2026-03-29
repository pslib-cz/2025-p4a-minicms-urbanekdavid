import type { Metadata } from "next";

const baseUrl = process.env.NEXT_PUBLIC_URL || "http://localhost:3000";

export function siteMetadata(overrides?: Partial<Metadata>): Metadata {
  return {
    title: {
      default: "ThreadClip",
      template: "%s | ThreadClip",
    },
    description: "Video publishing platform for creators",
    metadataBase: new URL(baseUrl),
    openGraph: {
      type: "website",
      siteName: "ThreadClip",
      locale: "en_US",
      images: [{ url: "/og-default.jpg", width: 1200, height: 630 }],
    },
    twitter: {
      card: "summary_large_image",
    },
    ...overrides,
  };
}
