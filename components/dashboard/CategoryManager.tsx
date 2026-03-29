"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { useToast } from "@/hooks/useToast";

interface Category {
  id: string;
  name: string;
  slug: string;
  _count?: { videoPosts: number };
}

export function CategoryManager({ categories }: { categories: Category[] }) {
  const [name, setName] = useState("");
  const [editId, setEditId] = useState<string | null>(null);
  const [editName, setEditName] = useState("");
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const { addToast } = useToast();
  const router = useRouter();

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) return;
    setLoading(true);

    const res = await fetch("/api/categories", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name }),
    });

    if (res.ok) {
      addToast("Category created", "success");
      setName("");
      router.refresh();
    } else {
      const data = await res.json();
      addToast(data.error || "Failed to create", "error");
    }
    setLoading(false);
  }

  async function handleUpdate() {
    if (!editId || !editName.trim()) return;
    setLoading(true);

    const res = await fetch(`/api/categories/${editId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: editName }),
    });

    if (res.ok) {
      addToast("Category updated", "success");
      setEditId(null);
      router.refresh();
    } else {
      addToast("Failed to update", "error");
    }
    setLoading(false);
  }

  async function handleDelete() {
    if (!deleteId) return;
    setLoading(true);

    const res = await fetch(`/api/categories/${deleteId}`, { method: "DELETE" });
    if (res.ok) {
      addToast("Category deleted", "success");
      router.refresh();
    } else {
      addToast("Failed to delete", "error");
    }
    setDeleteId(null);
    setLoading(false);
  }

  return (
    <div className="manager">
      <form onSubmit={handleCreate} className="manager-form">
        <Input
          placeholder="New category name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <Button type="submit" loading={loading} size="sm">Add</Button>
      </form>

      <div className="manager-list">
        {categories.map((cat) => (
          <div key={cat.id} className="manager-item">
            <div className="manager-item-info">
              <span className="manager-item-name">{cat.name}</span>
              <span className="manager-item-count">{cat._count?.videoPosts || 0} videos</span>
            </div>
            <div className="manager-item-actions">
              <button
                className="btn btn-ghost btn-sm"
                onClick={() => { setEditId(cat.id); setEditName(cat.name); }}
              >
                Edit
              </button>
              <button
                className="btn btn-danger btn-sm"
                onClick={() => setDeleteId(cat.id)}
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      <Modal open={!!editId} onClose={() => setEditId(null)} title="Edit Category">
        <Input value={editName} onChange={(e) => setEditName(e.target.value)} />
        <div className="modal-actions">
          <Button variant="ghost" onClick={() => setEditId(null)}>Cancel</Button>
          <Button onClick={handleUpdate} loading={loading}>Save</Button>
        </div>
      </Modal>

      <Modal open={!!deleteId} onClose={() => setDeleteId(null)} title="Delete Category">
        <p>Are you sure? Videos in this category will become uncategorized.</p>
        <div className="modal-actions">
          <Button variant="ghost" onClick={() => setDeleteId(null)}>Cancel</Button>
          <Button variant="danger" onClick={handleDelete} loading={loading}>Delete</Button>
        </div>
      </Modal>
    </div>
  );
}
