import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { VideoForm } from "@/components/dashboard/VideoForm";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "New Video" };

export default async function NewVideoPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/auth/signin");

  const [categories, tags] = await Promise.all([
    prisma.category.findMany({ orderBy: { name: "asc" } }),
    prisma.tag.findMany({ orderBy: { name: "asc" } }),
  ]);

  return (
    <div className="dashboard-page">
      <h1>Create New Video</h1>
      <VideoForm categories={categories} tags={tags} />
    </div>
  );
}
