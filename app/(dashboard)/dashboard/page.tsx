import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { VideoTable } from "@/components/dashboard/VideoTable";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Dashboard" };

export default async function DashboardPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/auth/signin");

  const videos = await prisma.videoPost.findMany({
    where: { authorId: session.user.id },
    orderBy: { createdAt: "desc" },
    include: {
      category: { select: { name: true } },
    },
  });

  const serialized = videos.map((v) => ({
    id: v.id,
    title: v.title,
    slug: v.slug,
    thumbnailUrl: v.thumbnailUrl,
    status: v.status as "DRAFT" | "PUBLISHED",
    createdAt: v.createdAt.toISOString(),
    publishDate: v.publishDate?.toISOString() || null,
    category: v.category,
  }));

  return (
    <div className="dashboard-page">
      <div className="dashboard-page-header">
        <h1>My Videos</h1>
        <Link href="/dashboard/new" className="btn btn-primary">New Video</Link>
      </div>
      <VideoTable videos={serialized} />
    </div>
  );
}
