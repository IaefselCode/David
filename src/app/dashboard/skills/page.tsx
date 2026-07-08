"use client";
import { useEffect, useState } from "react";
import { SKILL_ICONS, getSkillIconUrl, type SkillIcon } from "@/lib/skill-icons";

export default function SkillsPage() {
  const [skills, setSkills] = useState<any[]>([]);
  const [newName, setNewName] = useState("");
  const [search, setSearch] = useState("");
  const [selectedSlug, setSelectedSlug] = useState("react");
  const [adding, setAdding] = useState(false);
  const [deleting, setDeleting] = useState<number | null>(null);
  const [msg, setMsg] = useState("");

  useEffect(() => {
    fetch("/api/skills").then((r) => r.json()).then(setSkills);
  }, []);

  function flash(text: string) {
    setMsg(text);
    setTimeout(() => setMsg(""), 2000);
  }

  async function handleDelete(id: number) {
    if (!window.confirm("Delete this skill?")) return;
    setDeleting(id);
    await fetch(`/api/skills/${id}`, { method: "DELETE" });
    setSkills(skills.filter((s) => s.id !== id));
    setDeleting(null);
    flash("Deleted!");
  }

  async function handleAdd() {
    if (!newName) return;
    setAdding(true);
    const res = await fetch("/api/skills", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: newName, icon: selectedSlug, sort: skills.length }),
    });
    const skill = await res.json();
    setSkills([...skills, skill]);
    setNewName("");
    setSelectedSlug("react");
    setAdding(false);
    flash("Added!");
  }

  const filtered = search
    ? SKILL_ICONS.filter((i) =>
        i.name.toLowerCase().includes(search.toLowerCase())
      )
    : SKILL_ICONS;

  return (
    <div>
      <h1 className="text-2xl font-semibold tracking-tight mb-6">Skills</h1>

      <div className="flex gap-2 mb-4">
        <input
          placeholder="Skill name"
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
          className="px-3 py-2 border border-border rounded-lg bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring flex-1"
        />
        <button
          onClick={handleAdd}
          disabled={adding}
          className="px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:opacity-90 transition-opacity cursor-pointer shrink-0 disabled:opacity-50"
        >
          {adding ? "Adding..." : "Add"}
        </button>
        {msg && <span className="text-sm text-green-600 font-medium shrink-0">{msg}</span>}
      </div>

      <div className="mb-2">
        <input
          placeholder="Search icons..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full px-3 py-2 border border-border rounded-lg bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
        />
      </div>

      {selectedSlug && (
        <div className="flex items-center gap-2 mb-3 text-sm text-muted-foreground">
          <span>Selected:</span>
          <img src={getSkillIconUrl(selectedSlug)} alt={selectedSlug} className="size-6" />
          <code className="text-xs bg-muted px-1.5 py-0.5 rounded">{selectedSlug}</code>
        </div>
      )}

      <div className="grid grid-cols-8 sm:grid-cols-12 md:grid-cols-16 gap-1.5 mb-8 max-h-60 overflow-y-auto border border-border rounded-lg p-2">
        {filtered.map((icon) => (
          <button
            key={icon.slug}
            onClick={() => setSelectedSlug(icon.slug)}
            className={`p-1.5 rounded-lg border transition-all cursor-pointer flex items-center justify-center ${
              selectedSlug === icon.slug
                ? "border-primary ring-2 ring-primary/30 bg-primary/10"
                : "border-border hover:border-muted-foreground hover:bg-muted"
            }`}
            title={icon.name}
          >
            <img src={getSkillIconUrl(icon.slug)} alt={icon.name} className="size-6" />
          </button>
        ))}
        {filtered.length === 0 && (
          <p className="col-span-full text-center text-sm text-muted-foreground py-4">
            No icons found
          </p>
        )}
      </div>

      <div className="space-y-2">
        {skills.length === 0 && (
          <p className="text-sm text-muted-foreground/50 italic py-4">No skills added yet.</p>
        )}
        {skills.map((skill) => (
          <div key={skill.id} className="flex items-center justify-between border border-border rounded-lg px-4 py-3">
            <div className="flex items-center gap-2">
              {skill.icon && (
                <img src={getSkillIconUrl(skill.icon)} alt={skill.icon} className="size-5" />
              )}
              <span className="font-medium text-sm">{skill.name}</span>
              <span className="text-xs text-muted-foreground ml-1">({skill.icon})</span>
            </div>
            <button
              onClick={() => handleDelete(skill.id)}
              className="text-xs text-red-500 hover:text-red-600 cursor-pointer"
            >
              Delete
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
