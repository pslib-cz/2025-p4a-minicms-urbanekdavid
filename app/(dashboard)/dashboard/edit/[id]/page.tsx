import { notFound, redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { VideoForm } from "@/components/dashboard/VideoForm";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Edit Video" };

type PageProps = { params: Promise<{ id: string }> };

export default async function EditVideoPage({ params }: PageProps) {
  const session = await auth();
  if (!session?.user?.id) redirect("/auth/signin");

  const { id } = await params;

  const video = await prisma.videoPost.findUnique({
    where: { id },
    include: {
      tags: { include: { tag: true } },
    },
  });

  if (!video || video.authorId !== session.user.id) notFound();

  const [categories, tags] = await Promise.all([
    prisma.category.findMany({ orderBy: { name: "asc" } }),
    prisma.tag.findMany({ orderBy: { name: "asc" } }),
  ]);

  return (
    <div className="dashboard-page">
      <h1>Edit Video</h1>
      <VideoForm video={video} categories={categories} tags={tags} />
    </div>
  );
}
