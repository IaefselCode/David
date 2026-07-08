"use client";
import { useEffect, useState } from "react";
import FileUpload from "@/components/file-upload";

const emptyForm = { title: "", href: "", dates: "", description: "", image: "", video: "", technologies: "", links: "" };

export default function ProjectsPage() {
  const [items, setItems] = useState<any[]>([]);
  const [editing, setEditing] = useState<any | null>(null);
  const [form, setForm] = useState(emptyForm);

  useEffect(() => {
    fetch("/api/projects").then((r) => r.json()).then(setItems);
  }, []);

  async function handleSave() {
    const techs = form.technologies.split(",").map((s) => s.trim()).filter(Boolean);
    const body = { title: form.title, href: form.href, dates: form.dates, description: form.description, image: form.image, video: form.video, technologies: techs, links: [], active: true };

    if (editing?.id) {
      await fetch(`/api/projects/${editing.id}`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
      setItems(items.map((p) => (p.id === editing.id ? { ...p, ...body, technologies: techs.map((n) => ({ name: n })) } : p)));
    } else {
      const res = await fetch("/api/projects", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ ...body, sort: items.length }) });
      const item = await res.json();
      setItems([...items, item]);
    }
    setEditing(null);
    setForm(emptyForm);
  }

  async function handleDelete(id: number) {
    await fetch(`/api/projects/${id}`, { method: "DELETE" });
    setItems(items.filter((p) => p.id !== id));
  }

  function startEdit(item: any) {
    setEditing(item);
    setForm({
      title: item.title || "", href: item.href || "", dates: item.dates || "", description: item.description || "",
      image: item.image || "", video: item.video || "",
      technologies: (item.technologies || []).map((t: any) => t.name || t).join(", "),
      links: "",
    });
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold tracking-tight">Projects</h1>
        {!editing && (
          <button onClick={() => { setEditing({}); setForm(emptyForm); }} className="px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:opacity-90 cursor-pointer">
            Add Project
          </button>
        )}
      </div>

      {editing && (
        <div className="border border-border rounded-xl p-5 space-y-3 mb-6">
          <h2 className="font-semibold">{editing.id ? "Edit Project" : "New Project"}</h2>
          <div className="grid grid-cols-2 gap-3">
            {["title", "href", "dates"].map((field) => (
              <div key={field}>
                <label className="text-xs font-medium block mb-1 capitalize">{field}</label>
                <input value={form[field as keyof typeof form]} onChange={(e) => setForm({ ...form, [field]: e.target.value })} className="w-full px-3 py-2 border border-border rounded-lg bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring" />
              </div>
            ))}
            <div>
              <label className="text-xs font-medium block mb-1">Image</label>
              <FileUpload value={form.image || ""} onChange={(url) => setForm({ ...form, image: url })} />
            </div>
            <div>
              <label className="text-xs font-medium block mb-1">Video</label>
              <FileUpload value={form.video || ""} onChange={(url) => setForm({ ...form, video: url })} accept="video/*" />
            </div>
          </div>
          <div>
            <label className="text-xs font-medium block mb-1">Description</label>
            <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="w-full px-3 py-2 border border-border rounded-lg bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring" rows={3} />
          </div>
          <div>
            <label className="text-xs font-medium block mb-1">Technologies (comma separated)</label>
            <input value={form.technologies} onChange={(e) => setForm({ ...form, technologies: e.target.value })} className="w-full px-3 py-2 border border-border rounded-lg bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring" />
          </div>
          <div className="flex gap-2">
            <button onClick={handleSave} className="px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:opacity-90 cursor-pointer">Save</button>
            <button onClick={() => { setEditing(null); setForm(emptyForm); }} className="px-4 py-2 border border-border rounded-lg text-sm text-muted-foreground hover:text-foreground cursor-pointer">Cancel</button>
          </div>
        </div>
      )}

      <div className="space-y-2">
        {items.length === 0 && (
          <p className="text-sm text-muted-foreground/50 italic py-4">No projects yet.</p>
        )}
        {items.map((item) => (
          <div key={item.id} className="flex items-center justify-between border border-border rounded-lg px-4 py-3">
            <div className="flex-1 min-w-0">
              <div className="font-medium text-sm">{item.title}</div>
              <div className="text-xs text-muted-foreground truncate">{item.dates} &middot; {(item.technologies || []).map((t: any) => t.name || t).join(", ")}</div>
            </div>
            <div className="flex gap-2 shrink-0 ml-3">
              <button onClick={() => startEdit(item)} className="px-3 py-1 border border-border rounded-md text-xs hover:bg-muted cursor-pointer">Edit</button>
              <button onClick={() => handleDelete(item.id)} className="px-3 py-1 bg-destructive text-destructive-foreground rounded-md text-xs hover:opacity-90 cursor-pointer">Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
