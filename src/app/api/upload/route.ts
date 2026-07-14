import { NextResponse } from "next/server";
import { put } from "@vercel/blob";
import { writeFile, mkdir } from "fs/promises";
import path from "path";
import { deleteFile } from "@/lib/delete-file";

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;
    if (!file) return NextResponse.json({ error: "No file" }, { status: 400 });

    const oldUrl = formData.get("oldUrl") as string | null;
    if (oldUrl) await deleteFile(oldUrl);

    const ext = file.name.split(".").pop();
    const filename = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;

    const useBlob =
      process.env.BLOB_READ_WRITE_TOKEN || process.env.VERCEL_ENV === "production";

    if (useBlob) {
      const blob = await put(filename, file, { access: "public" });
      return NextResponse.json({ url: blob.url });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const uploadDir = path.join(process.cwd(), "public", "uploads");
    await mkdir(uploadDir, { recursive: true });
    await writeFile(path.join(uploadDir, filename), buffer);
    return NextResponse.json({ url: `/uploads/${filename}` });
  } catch (e) {
    console.error("Upload error:", e instanceof Error ? e.message : e);
    console.error("Stack:", e instanceof Error ? e.stack : "");
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }
}
