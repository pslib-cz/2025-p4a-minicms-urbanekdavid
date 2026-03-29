import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { TagManager } from "@/components/dashboard/TagManager";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Tags" };

export default async function TagsPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/auth/signin");

  const tags = await prisma.tag.findMany({
    orderBy: { name: "asc" },
    include: { _count: { select: { videos: true } } },
  });

  return (
    <div className="dashboard-page">
      <h1>Tags</h1>
      <TagManager tags={tags} />
    </div>
  );
}
