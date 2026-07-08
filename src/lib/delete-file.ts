import { unlink } from "fs/promises";
import path from "path";

export async function deleteFile(url: string | null | undefined) {
  if (!url || !url.startsWith("/uploads/")) return;
  try {
    await unlink(path.join(process.cwd(), "public", url));
  } catch {
    // file may not exist, ignore
  }
}
