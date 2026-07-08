"use client";
import { useEffect, useState } from "react";
import FileUpload from "@/components/file-upload";

export default function ProfilePage() {
  const [form, setForm] = useState<any>(null);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState("");

  useEffect(() => {
    fetch("/api/data").then((r) => r.json()).then((d) => setForm(d.profile));
  }, []);

  async function handleSave() {
    setSaving(true);
    setMsg("");
    await fetch("/api/profile", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    setSaving(false);
    setMsg("Saved!");
    setTimeout(() => setMsg(""), 2000);
  }

  if (!form) return <p className="text-muted-foreground">Loading...</p>;

  const fields = [
    { key: "name", label: "Name" },
    { key: "location", label: "Location" },
    { key: "locationLink", label: "Location Link" },
    { key: "description", label: "Description" },

    { key: "email", label: "Email" },
    { key: "tel", label: "Phone" },
    { key: "githubUsername", label: "GitHub Username" },
    { key: "calLink", label: "Cal.com / Scheduling Link" },
  ];

  return (
    <div>
      <h1 className="text-2xl font-semibold tracking-tight mb-6">Profile</h1>
      <div className="space-y-4 max-w-xl">
        {fields.map(({ key, label }) => (
          <div key={key}>
            <label className="text-sm font-medium block mb-1">{label}</label>
            <textarea
              value={form[key] || ""}
              onChange={(e) => setForm({ ...form, [key]: e.target.value })}
              className="w-full px-3 py-2 border border-border rounded-lg bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
              rows={key === "description" || key === "summary" ? 3 : 1}
              placeholder={key === "calLink" ? "https://cal.com/username/15-min" : ""}
            />
          </div>
        ))}
        <div>
          <label className="text-sm font-medium block mb-1">Avatar</label>
          <FileUpload value={form.avatarUrl || ""} onChange={(url) => setForm({ ...form, avatarUrl: url })} />
        </div>
        <div>
          <label className="text-sm font-medium block mb-1">CV / Resume</label>
          <FileUpload value={form.cvUrl || ""} onChange={(url) => setForm({ ...form, cvUrl: url })} accept=".pdf,application/pdf" />
          {form.cvUrl && (
            <a href={form.cvUrl} target="_blank" className="text-xs text-muted-foreground hover:underline mt-1 inline-block">View current CV</a>
          )}
        </div>
        <div>
          <label className="text-sm font-medium block mb-1">Summary</label>
          <textarea
            value={form.summary || ""}
            onChange={(e) => setForm({ ...form, summary: e.target.value })}
            className="w-full px-3 py-2 border border-border rounded-lg bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            rows={6}
          />
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={handleSave}
            disabled={saving}
            className="px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:opacity-90 transition-opacity cursor-pointer disabled:opacity-50"
          >
            {saving ? "Saving..." : "Save"}
          </button>
          {msg && <span className="text-sm text-green-600 font-medium">{msg}</span>}
        </div>
      </div>
    </div>
  );
}
