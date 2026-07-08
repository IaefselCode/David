"use client";
import { useEffect, useState } from "react";

const ICONS = [
  "github", "linkedin", "x", "youtube",
  "instagram", "facebook", "tiktok",
  "telegram", "discord", "whatsapp",
  "email", "globe",
];

const emptySocial = { name: "", url: "", icon: "globe", navbar: false };

export default function ContactPage() {
  const [email, setEmail] = useState("");
  const [tel, setTel] = useState("");
  const [socials, setSocials] = useState<any[]>([]);
  const [editing, setEditing] = useState<any | null>(null);
  const [form, setForm] = useState(emptySocial);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("/api/contact")
      .then((r) => r.json())
      .then((d) => {
        setEmail(d.email || "");
        setTel(d.tel || "");
        setSocials(d.socialLinks || []);
      });
  }, []);

  function flash(text: string) {
    setMsg(text);
    setTimeout(() => setMsg(""), 2000);
  }

  async function handleSaveProfile(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError("");
    const res = await fetch("/api/contact", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, tel }),
    });
    setSaving(false);
    if (res.ok) {
      flash("Saved!");
    } else {
      const d = await res.json();
      setError(d.error || "Failed to save");
    }
  }

  async function handleSaveSocial() {
    if (!form.name || !form.url) return;
    if (editing?.id) {
      await fetch(`/api/social-links/${editing.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      setSocials(socials.map((s) => (s.id === editing.id ? { ...s, ...form } : s)));
    } else {
      const res = await fetch("/api/social-links", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, sort: socials.length }),
      });
      const item = await res.json();
      setSocials([...socials, item]);
    }
    setEditing(null);
    setForm(emptySocial);
  }

  async function handleDeleteSocial(id: number) {
    await fetch(`/api/social-links/${id}`, { method: "DELETE" });
    setSocials(socials.filter((s) => s.id !== id));
  }

  function startEdit(social: any) {
    setEditing(social);
    setForm({ name: social.name || "", url: social.url || "", icon: social.icon || "globe", navbar: social.navbar ?? false });
  }

  return (
    <div>
      <h1 className="text-2xl font-semibold tracking-tight mb-6">Contact</h1>
      {error && <p className="text-sm text-red-500 mb-4">{error}</p>}

      <form onSubmit={handleSaveProfile} className="max-w-xl space-y-4 mb-10">
        <h2 className="text-lg font-semibold tracking-tight">Contact Info</h2>
        <div>
          <label className="text-sm font-medium block mb-1">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-3 py-2 border border-border rounded-lg bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
          />
        </div>
        <div>
          <label className="text-sm font-medium block mb-1">Phone</label>
          <input
            value={tel}
            onChange={(e) => setTel(e.target.value)}
            className="w-full px-3 py-2 border border-border rounded-lg bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
          />
        </div>
        <div className="flex items-center gap-3">
          <button
            type="submit"
            disabled={saving}
            className="px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:opacity-90 transition-opacity cursor-pointer disabled:opacity-50"
          >
            {saving ? "Saving..." : "Save"}
          </button>
          <button
            type="button"
            onClick={() => { setEmail(""); setTel(""); }}
            className="px-4 py-2 border border-border rounded-lg text-sm text-muted-foreground hover:text-foreground cursor-pointer"
          >
            Clear
          </button>
          {msg && <span className="text-sm text-green-600 font-medium">{msg}</span>}
        </div>
      </form>

      <div className="max-w-xl">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold tracking-tight">Social Links</h2>
          {!editing && (
            <button
              onClick={() => { setEditing({}); setForm(emptySocial); }}
              className="px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:opacity-90 cursor-pointer"
            >
              Add Social Link
            </button>
          )}
        </div>
        <p className="text-xs text-muted-foreground mb-4">
          Social links with <strong>Show in Navbar</strong> enabled appear in the bottom dock on the public portfolio.
        </p>

        {editing && (
          <div className="border border-border rounded-xl p-5 space-y-3 mb-6">
            <h3 className="font-semibold">{editing.id ? "Edit Social Link" : "New Social Link"}</h3>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-medium block mb-1">Name</label>
                <input
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="GitHub"
                  className="w-full px-3 py-2 border border-border rounded-lg bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                />
              </div>
              <div>
                <label className="text-xs font-medium block mb-1">URL</label>
                <input
                  value={form.url}
                  onChange={(e) => setForm({ ...form, url: e.target.value })}
                  placeholder="https://github.com/username"
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
              <div className="flex items-end pb-2">
                <label className="flex items-center gap-2 text-sm cursor-pointer">
                  <input
                    type="checkbox"
                    checked={form.navbar}
                    onChange={(e) => setForm({ ...form, navbar: e.target.checked })}
                    className="size-4 accent-primary"
                  />
                  Show in Navbar
                </label>
              </div>
            </div>
            <div className="flex gap-2">
              <button onClick={handleSaveSocial} className="px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:opacity-90 cursor-pointer">Save</button>
              <button onClick={() => { setEditing(null); setForm(emptySocial); }} className="px-4 py-2 border border-border rounded-lg text-sm text-muted-foreground hover:text-foreground cursor-pointer">Cancel</button>
            </div>
          </div>
        )}

        <div className="space-y-2">
          {socials.length === 0 && (
            <p className="text-sm text-muted-foreground/50 italic py-4">No social links yet.</p>
          )}
          {socials.map((social) => (
            <div key={social.id} className="flex items-center justify-between border border-border rounded-lg px-4 py-3">
              <div className="flex-1 min-w-0">
                <div className="font-medium text-sm flex items-center gap-2">
                  {social.name}
                  {social.navbar && (
                    <span className="text-[10px] bg-muted text-muted-foreground px-1.5 py-0.5 rounded">navbar</span>
                  )}
                </div>
                <div className="text-xs text-muted-foreground truncate">
                  {social.url} &middot; icon: {social.icon}
                </div>
              </div>
              <div className="flex gap-2 shrink-0 ml-3">
                <button onClick={() => startEdit(social)} className="px-3 py-1 border border-border rounded-md text-xs hover:bg-muted cursor-pointer">Edit</button>
                <button onClick={() => handleDeleteSocial(social.id)} className="px-3 py-1 bg-destructive text-destructive-foreground rounded-md text-xs hover:opacity-90 cursor-pointer">Delete</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
