import { promises as fs } from "node:fs";
import path from "node:path";

const LOCAL_DIR = path.join(process.cwd(), ".data");

export function hasBlobStorage(): boolean {
  return Boolean(process.env.BLOB_READ_WRITE_TOKEN || process.env.VERCEL_OIDC_TOKEN);
}

function localFile(key: string): string {
  return path.join(LOCAL_DIR, key.replace(/[^a-zA-Z0-9._-]/g, "_"));
}

async function readBlob(key: string): Promise<string | null> {
  const { get } = await import("@vercel/blob");
  const result = (await get(key, {
    access: "private",
    useCache: false,
  } as never)) as unknown as {
    stream?: ReadableStream<Uint8Array> | null;
    blob?: { url?: string };
  };

  if (result?.stream) return new Response(result.stream).text();
  if (result?.blob?.url) {
    const response = await fetch(result.blob.url, { cache: "no-store" });
    if (response.ok) return response.text();
  }
  return null;
}

async function writeBlob(key: string, body: string): Promise<void> {
  const { put } = await import("@vercel/blob");
  await put(key, body, {
    access: "private",
    addRandomSuffix: false,
    allowOverwrite: true,
    contentType: "application/json",
  } as never);
}

export async function readJson<T>(key: string): Promise<T | null> {
  try {
    const text = hasBlobStorage()
      ? await readBlob(key)
      : await fs.readFile(localFile(key), "utf8");
    if (!text) return null;
    return JSON.parse(text) as T;
  } catch {
    return null;
  }
}

export async function writeJson<T>(key: string, value: T): Promise<void> {
  const body = JSON.stringify(value, null, 2);
  if (hasBlobStorage()) {
    await writeBlob(key, body);
    return;
  }
  if (process.env.VERCEL) {
    throw new Error("Falta conectar Vercel Blob para guardar el estado del streaming.");
  }
  await fs.mkdir(LOCAL_DIR, { recursive: true });
  await fs.writeFile(localFile(key), body, "utf8");
}
