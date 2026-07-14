import { del } from "@vercel/blob";
import { unlink } from "fs/promises";
import path from "path";

export async function deleteFile(url: string | null | undefined) {
  if (!url) return;

  if (url.startsWith("http")) {
    try {
      if (process.env.BLOB_READ_WRITE_TOKEN) await del(url);
    } catch {
      // blob may not exist, ignore
    }
    return;
  }

  if (!url.startsWith("/uploads/")) return;
  try {
    await unlink(path.join(process.cwd(), "public", url));
  } catch {
    // file may not exist, ignore
  }
}
