"use client";

import { useRef, useState } from "react";
import { FileText } from "lucide-react";

export default function FileUpload({
  value,
  onChange,
  accept = "image/*",
}: {
  value: string;
  onChange: (url: string) => void;
  accept?: string;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);

  const isPdf = accept.includes("pdf");

  async function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    const formData = new FormData();
    formData.append("file", file);
    if (value && value.startsWith("/uploads/")) formData.append("oldUrl", value);
    const res = await fetch("/api/upload", { method: "POST", body: formData });
    const data = await res.json();
    if (data.url) onChange(data.url);
    setUploading(false);
  }

  return (
    <div className="flex items-center gap-3">
      {value && (
        <>
          {isPdf ? (
            <div className="size-12 rounded border flex items-center justify-center bg-muted shrink-0">
              <FileText className="size-5 text-muted-foreground" />
            </div>
          ) : accept.includes("video") ? (
            <video src={value} className="size-12 rounded border object-cover shrink-0" />
          ) : (
            <img src={value} alt="" className="size-12 rounded border object-cover shrink-0" />
          )}
          <button
            type="button"
            onClick={() => onChange("")}
            className="px-2 py-1 border border-border rounded-lg text-xs text-red-500 hover:bg-muted cursor-pointer"
          >
            Clear
          </button>
        </>
      )}
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        disabled={uploading}
        className="px-3 py-1.5 border border-border rounded-lg text-xs hover:bg-muted cursor-pointer disabled:opacity-50"
      >
        {uploading ? "Uploading..." : "Choose File"}
      </button>
      <input ref={inputRef} type="file" accept={accept} onChange={handleFile} className="hidden" />
    </div>
  );
}
