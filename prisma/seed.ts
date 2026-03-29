import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const hash = await bcrypt.hash("password123", 10);

  const users = await Promise.all([
    prisma.user.upsert({
      where: { email: "alice@threadclip.com" },
      update: {},
      create: {
        name: "Alice Johnson",
        email: "alice@threadclip.com",
        password: hash,
        image: "https://i.pravatar.cc/150?u=alice",
      },
    }),
    prisma.user.upsert({
      where: { email: "bob@threadclip.com" },
      update: {},
      create: {
        name: "Bob Martinez",
        email: "bob@threadclip.com",
        password: hash,
        image: "https://i.pravatar.cc/150?u=bob",
      },
    }),
    prisma.user.upsert({
      where: { email: "carol@threadclip.com" },
      update: {},
      create: {
        name: "Carol Chen",
        email: "carol@threadclip.com",
        password: hash,
        image: "https://i.pravatar.cc/150?u=carol",
      },
    }),
  ]);

  const categories = await Promise.all(
    [
      { name: "Technology", slug: "technology" },
      { name: "Music", slug: "music" },
      { name: "Sports", slug: "sports" },
      { name: "Art", slug: "art" },
      { name: "Education", slug: "education" },
    ].map((c) =>
      prisma.category.upsert({
        where: { slug: c.slug },
        update: {},
        create: c,
      })
    )
  );

  const tagNames = [
    "javascript",
    "react",
    "nextjs",
    "tutorial",
    "beginner",
    "advanced",
    "live",
    "podcast",
    "interview",
    "demo",
    "review",
    "howto",
    "webdev",
    "design",
    "ai",
  ];

  const tags = await Promise.all(
    tagNames.map((name) =>
      prisma.tag.upsert({
        where: { slug: name },
        update: {},
        create: { name, slug: name },
      })
    )
  );

  const videos = [
    {
      title: "Building Modern Web Apps with Next.js",
      excerpt: "A comprehensive guide to building production-ready applications with Next.js App Router.",
      content: "<p>In this video we explore the latest features of Next.js including Server Components, streaming, and the App Router architecture.</p>",
      videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
      thumbnailUrl: "https://picsum.photos/seed/vid1/1280/720",
      duration: 596,
      status: "PUBLISHED" as const,
      publishDate: new Date("2026-03-01"),
      authorId: users[0].id,
      categoryId: categories[0].id,
      tagSlugs: ["nextjs", "webdev", "tutorial"],
    },
    {
      title: "React Server Components Explained",
      excerpt: "Deep dive into how React Server Components work under the hood.",
      content: "<p>Server Components represent a paradigm shift in how we think about React applications.</p>",
      videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
      thumbnailUrl: "https://picsum.photos/seed/vid2/1280/720",
      duration: 653,
      status: "PUBLISHED" as const,
      publishDate: new Date("2026-03-05"),
      authorId: users[0].id,
      categoryId: categories[0].id,
      tagSlugs: ["react", "advanced"],
    },
    {
      title: "CSS Architecture for Large Projects",
      excerpt: "How to structure CSS using custom properties and modern layout techniques.",
      content: "<p>Stop fighting your CSS. Learn how to architect scalable stylesheets using custom properties, container queries, and logical properties.</p>",
      videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
      thumbnailUrl: "https://picsum.photos/seed/vid3/1280/720",
      duration: 185,
      status: "PUBLISHED" as const,
      publishDate: new Date("2026-03-08"),
      authorId: users[1].id,
      categoryId: categories[0].id,
      tagSlugs: ["design", "webdev", "tutorial"],
    },
    {
      title: "Live Coding: Building a Music Visualizer",
      excerpt: "Watch as we build a real-time audio visualizer using the Web Audio API and Canvas.",
      content: "<p>From zero to a stunning music visualizer in one session. Using the Web Audio API, Canvas, and some creative math.</p>",
      videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4",
      thumbnailUrl: "https://picsum.photos/seed/vid4/1280/720",
      duration: 245,
      status: "PUBLISHED" as const,
      publishDate: new Date("2026-03-10"),
      authorId: users[1].id,
      categoryId: categories[1].id,
      tagSlugs: ["live", "javascript", "demo"],
    },
    {
      title: "The Art of Digital Illustration",
      excerpt: "Techniques and workflows for creating stunning digital art.",
      content: "<p>A deep exploration of digital illustration techniques, from sketching to final render.</p>",
      videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4",
      thumbnailUrl: "https://picsum.photos/seed/vid5/1280/720",
      duration: 362,
      status: "PUBLISHED" as const,
      publishDate: new Date("2026-03-12"),
      authorId: users[2].id,
      categoryId: categories[3].id,
      tagSlugs: ["design", "tutorial"],
    },
    {
      title: "JavaScript Performance Masterclass",
      excerpt: "Learn how to profile and optimize JavaScript applications for maximum performance.",
      content: "<p>Memory leaks, render blocking, bundle size - we tackle all the common performance pitfalls.</p>",
      videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4",
      thumbnailUrl: "https://picsum.photos/seed/vid6/1280/720",
      duration: 478,
      status: "PUBLISHED" as const,
      publishDate: new Date("2026-03-14"),
      authorId: users[0].id,
      categoryId: categories[0].id,
      tagSlugs: ["javascript", "advanced"],
    },
    {
      title: "Interview: The Future of AI in Creative Tools",
      excerpt: "A conversation with leading AI researchers about the intersection of AI and creativity.",
      content: "<p>We sit down with researchers from the forefront of generative AI to discuss where creative tools are heading.</p>",
      videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4",
      thumbnailUrl: "https://picsum.photos/seed/vid7/1280/720",
      duration: 312,
      status: "PUBLISHED" as const,
      publishDate: new Date("2026-03-16"),
      authorId: users[2].id,
      categoryId: categories[0].id,
      tagSlugs: ["ai", "interview", "podcast"],
    },
    {
      title: "Sports Analytics with Python",
      excerpt: "Using data science to analyze sports performance and predict outcomes.",
      content: "<p>From data collection to visualization, learn how modern sports teams use analytics.</p>",
      videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4",
      thumbnailUrl: "https://picsum.photos/seed/vid8/1280/720",
      duration: 888,
      status: "PUBLISHED" as const,
      publishDate: new Date("2026-03-17"),
      authorId: users[1].id,
      categoryId: categories[2].id,
      tagSlugs: ["tutorial", "beginner"],
    },
    {
      title: "React Hooks Deep Dive",
      excerpt: "Everything you need to know about React hooks, from basics to custom hooks.",
      content: "<p>We cover useState, useEffect, useCallback, useMemo, useRef, and building your own custom hooks.</p>",
      videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/SubaruOutbackOnStreetAndDirt.mp4",
      thumbnailUrl: "https://picsum.photos/seed/vid9/1280/720",
      duration: 534,
      status: "PUBLISHED" as const,
      publishDate: new Date("2026-03-18"),
      authorId: users[0].id,
      categoryId: categories[4].id,
      tagSlugs: ["react", "tutorial", "howto"],
    },
    {
      title: "Music Production Basics",
      excerpt: "Getting started with digital music production using free tools.",
      content: "<p>You don't need expensive software to make great music. We show you how to get started with free DAWs and plugins.</p>",
      videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4",
      thumbnailUrl: "https://picsum.photos/seed/vid10/1280/720",
      duration: 734,
      status: "PUBLISHED" as const,
      publishDate: new Date("2026-03-19"),
      authorId: users[2].id,
      categoryId: categories[1].id,
      tagSlugs: ["beginner", "tutorial"],
    },
    {
      title: "TypeScript Generics Workshop",
      excerpt: "Master TypeScript generics with practical examples and real-world patterns.",
      content: "<p>Generics are the most powerful feature in TypeScript. Let's master them together.</p>",
      videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/VolkswagenGTIReview.mp4",
      thumbnailUrl: "https://picsum.photos/seed/vid11/1280/720",
      duration: 445,
      status: "PUBLISHED" as const,
      publishDate: new Date("2026-03-20"),
      authorId: users[0].id,
      categoryId: categories[4].id,
      tagSlugs: ["javascript", "advanced", "tutorial"],
    },
    {
      title: "Designing Accessible Interfaces",
      excerpt: "How to build interfaces that work for everyone, including people with disabilities.",
      content: "<p>Accessibility is not an afterthought. Learn how to bake it into your design process from the start.</p>",
      videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/WeAreGoingOnBullrun.mp4",
      thumbnailUrl: "https://picsum.photos/seed/vid12/1280/720",
      duration: 398,
      status: "PUBLISHED" as const,
      publishDate: new Date("2026-03-21"),
      authorId: users[1].id,
      categoryId: categories[3].id,
      tagSlugs: ["design", "webdev", "howto"],
    },
    {
      title: "Building a Real-Time Chat App",
      excerpt: "From WebSockets to deployment: building a production chat application.",
      content: "<p>We build a full chat application with typing indicators, read receipts, and message reactions.</p>",
      videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/WhatCarCanYouGetForAGrand.mp4",
      thumbnailUrl: "https://picsum.photos/seed/vid13/1280/720",
      duration: 567,
      status: "PUBLISHED" as const,
      publishDate: new Date("2026-03-22"),
      authorId: users[2].id,
      categoryId: categories[0].id,
      tagSlugs: ["javascript", "demo", "advanced"],
    },
    {
      title: "Yoga for Developers",
      excerpt: "Combat desk strain with these targeted yoga flows designed for programmers.",
      content: "<p>30-minute yoga sessions specifically designed for people who spend long hours at a desk.</p>",
      videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
      thumbnailUrl: "https://picsum.photos/seed/vid14/1280/720",
      duration: 1800,
      status: "PUBLISHED" as const,
      publishDate: new Date("2026-03-23"),
      authorId: users[1].id,
      categoryId: categories[2].id,
      tagSlugs: ["beginner", "howto"],
    },
    {
      title: "AI Image Generation Review",
      excerpt: "Comparing the latest AI image generation tools and their creative potential.",
      content: "<p>We test and compare DALL-E, Midjourney, Stable Diffusion, and more.</p>",
      videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
      thumbnailUrl: "https://picsum.photos/seed/vid15/1280/720",
      duration: 423,
      status: "PUBLISHED" as const,
      publishDate: new Date("2026-03-24"),
      authorId: users[0].id,
      categoryId: categories[3].id,
      tagSlugs: ["ai", "review"],
    },
    {
      title: "Database Design Patterns",
      excerpt: "Essential database design patterns every developer should know.",
      content: "<p>From normalization to denormalization, indexing strategies, and query optimization.</p>",
      videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
      thumbnailUrl: "https://picsum.photos/seed/vid16/1280/720",
      duration: 289,
      status: "DRAFT" as const,
      authorId: users[0].id,
      categoryId: categories[4].id,
      tagSlugs: ["tutorial", "advanced"],
    },
    {
      title: "Electronic Music Theory",
      excerpt: "Understanding music theory concepts applied to electronic music production.",
      content: "<p>Scales, chords, progressions - all explained in the context of electronic music.</p>",
      videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4",
      thumbnailUrl: "https://picsum.photos/seed/vid17/1280/720",
      duration: 567,
      status: "DRAFT" as const,
      authorId: users[2].id,
      categoryId: categories[1].id,
      tagSlugs: ["beginner"],
    },
    {
      title: "Upcoming: WebGPU Graphics Programming",
      excerpt: "Preview of our upcoming series on WebGPU for real-time graphics in the browser.",
      content: "<p>WebGPU brings native-quality graphics to the web. Here's what's coming.</p>",
      videoUrl: null,
      thumbnailUrl: "https://picsum.photos/seed/vid18/1280/720",
      duration: null,
      status: "DRAFT" as const,
      authorId: users[1].id,
      categoryId: categories[0].id,
      tagSlugs: ["webdev", "advanced"],
    },
    {
      title: "Skateboarding Trick Breakdowns",
      excerpt: "Frame-by-frame analysis of professional skateboarding tricks.",
      content: "<p>Using slow motion video analysis to break down the mechanics of skateboarding tricks.</p>",
      videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4",
      thumbnailUrl: "https://picsum.photos/seed/vid19/1280/720",
      duration: 234,
      status: "DRAFT" as const,
      authorId: users[1].id,
      categoryId: categories[2].id,
      tagSlugs: ["review", "demo"],
    },
    {
      title: "Node.js Streams Masterclass",
      excerpt: "Understanding and leveraging Node.js streams for efficient data processing.",
      content: "<p>Streams are one of the most powerful and misunderstood features of Node.js.</p>",
      videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4",
      thumbnailUrl: "https://picsum.photos/seed/vid20/1280/720",
      duration: 445,
      status: "PUBLISHED" as const,
      publishDate: new Date("2026-03-25"),
      authorId: users[2].id,
      categoryId: categories[0].id,
      tagSlugs: ["javascript", "advanced", "tutorial"],
    },
  ];

  for (const video of videos) {
    const { tagSlugs, ...data } = video;
    const slug = data.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)+/g, "");

    const created = await prisma.videoPost.upsert({
      where: { slug },
      update: {},
      create: {
        ...data,
        slug,
      },
    });

    for (const tagSlug of tagSlugs) {
      const tag = tags.find((t) => t.slug === tagSlug);
      if (tag) {
        await prisma.tagsOnVideos.upsert({
          where: { videoId_tagId: { videoId: created.id, tagId: tag.id } },
          update: {},
          create: { videoId: created.id, tagId: tag.id },
        });
      }
    }
  }

  console.log("Seed completed");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
