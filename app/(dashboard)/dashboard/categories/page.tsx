import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { CategoryManager } from "@/components/dashboard/CategoryManager";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Categories" };

export default async function CategoriesPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/auth/signin");

  const categories = await prisma.category.findMany({
    orderBy: { name: "asc" },
    include: { _count: { select: { videoPosts: true } } },
  });

  return (
    <div className="dashboard-page">
      <h1>Categories</h1>
      <CategoryManager categories={categories} />
    </div>
  );
}
