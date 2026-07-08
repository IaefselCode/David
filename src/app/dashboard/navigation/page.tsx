"use client";
import { useEffect, useState } from "react";

const ICONS = [
  "home", "github", "linkedin", "x", "youtube",
  "instagram", "facebook", "tiktok",
  "telegram", "discord", "whatsapp",
  "email", "globe",
];

const emptyForm = { label: "", href: "", icon: "home" };

export default function NavigationPage() {
  const [items, setItems] = useState<any[]>([]);
  const [editing, setEditing] = useState<any | null>(null);
  const [form, setForm] = useState(emptyForm);

  useEffect(() => {
    fetch("/api/navbar-items").then((r) => r.json()).then(setItems);
  }, []);

  async function handleSave() {
    if (!form.label || !form.href) return;
    if (editing?.id) {
      await fetch(`/api/navbar-items/${editing.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      setItems(items.map((e) => (e.id === editing.id ? { ...e, ...form } : e)));
    } else {
      const res = await fetch("/api/navbar-items", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, sort: items.length }),
      });
      const item = await res.json();
      setItems([...items, item]);
    }
    setEditing(null);
    setForm(emptyForm);
  }

  async function handleDelete(id: number) {
    await fetch(`/api/navbar-items/${id}`, { method: "DELETE" });
    setItems(items.filter((e) => e.id !== id));
  }

  function startEdit(item: any) {
    setEditing(item);
    setForm({ label: item.label || "", href: item.href || "", icon: item.icon || "home" });
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold tracking-tight">Navigation</h1>
        {!editing && (
          <button onClick={() => { setEditing({}); setForm(emptyForm); }} className="px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:opacity-90 cursor-pointer">
            Add Nav Item
          </button>
        )}
      </div>

      {editing && (
        <div className="border border-border rounded-xl p-5 space-y-3 mb-6 max-w-xl">
          <h2 className="font-semibold">{editing.id ? "Edit Nav Item" : "New Nav Item"}</h2>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-medium block mb-1">Label</label>
              <input
                value={form.label}
                onChange={(e) => setForm({ ...form, label: e.target.value })}
                placeholder="Home"
                className="w-full px-3 py-2 border border-border rounded-lg bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>
            <div>
              <label className="text-xs font-medium block mb-1">URL</label>
              <input
                value={form.href}
                onChange={(e) => setForm({ ...form, href: e.target.value })}
                placeholder="/"
                className="w-full px-3 py-2 border border-border rounded-lg bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>
            <div>
              <label className="text-xs font-medium block mb-1">Icon</label>
              <select
                value={form.icon}
                onChange={(e) => setForm({ ...form, icon: e.target.value })}
                className="w-full px-3 py-2 border border-border rounded-lg bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
              >
                {ICONS.map((icon) => (
                  <option key={icon} value={icon}>{icon}</option>
                ))}
              </select>
            </div>
          </div>
          <div className="flex gap-2">
            <button onClick={handleSave} className="px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:opacity-90 cursor-pointer">Save</button>
            <button onClick={() => { setEditing(null); setForm(emptyForm); }} className="px-4 py-2 border border-border rounded-lg text-sm text-muted-foreground hover:text-foreground cursor-pointer">Cancel</button>
          </div>
        </div>
      )}

      <div className="space-y-2 max-w-xl">
        {items.length === 0 && (
          <p className="text-sm text-muted-foreground/50 italic py-4">No nav items yet.</p>
        )}
        {items.map((item) => (
          <div key={item.id} className="flex items-center justify-between border border-border rounded-lg px-4 py-3">
            <div className="flex-1 min-w-0">
              <div className="font-medium text-sm">{item.label}</div>
              <div className="text-xs text-muted-foreground truncate">
                {item.href} &middot; icon: {item.icon}
              </div>
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
