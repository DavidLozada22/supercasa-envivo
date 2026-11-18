import { promises as fs } from "node:fs";
import path from "node:path";
import type { AppConfig } from "./types";

const BLOB_KEY = "supercasa/config.json";
const LOCAL_DIR = path.join(process.cwd(), ".data");
const LOCAL_FILE = path.join(LOCAL_DIR, "config.json");

function hasBlob(): boolean {
  return Boolean(process.env.BLOB_READ_WRITE_TOKEN || process.env.VERCEL_OIDC_TOKEN);
}

async function readFromBlob(): Promise<AppConfig | null> {
  const { get } = await import("@vercel/blob");
  const result = (await get(BLOB_KEY, { access: "private" } as never)) as unknown as {
    stream?: ReadableStream<Uint8Array> | null;
    blob?: { url?: string };
  };

  if (result?.stream) {
    const text = await new Response(result.stream).text();
    return JSON.parse(text) as AppConfig;
  }

  if (result?.blob?.url) {
    const response = await fetch(result.blob.url, { cache: "no-store" });
    if (response.ok) return (await response.json()) as AppConfig;
  }

  return null;
}

async function writeToBlob(config: AppConfig): Promise<void> {
  const { put } = await import("@vercel/blob");
  await put(BLOB_KEY, JSON.stringify(config, null, 2), {
    access: "private",
    addRandomSuffix: false,
    allowOverwrite: true,
    contentType: "application/json",
  } as never);
}

async function readLocal(): Promise<AppConfig | null> {
  try {
    const text = await fs.readFile(LOCAL_FILE, "utf8");
    return JSON.parse(text) as AppConfig;
  } catch {
    return null;
  }
}

async function writeLocal(config: AppConfig): Promise<void> {
  await fs.mkdir(LOCAL_DIR, { recursive: true });
  await fs.writeFile(LOCAL_FILE, JSON.stringify(config, null, 2), "utf8");
}

export async function readConfig(): Promise<AppConfig | null> {
  if (hasBlob()) {
    try {
      return await readFromBlob();
    } catch {
      return null;
    }
  }
  return readLocal();
}

export async function writeConfig(config: AppConfig): Promise<void> {
  if (hasBlob()) {
    await writeToBlob(config);
    return;
  }
  if (process.env.VERCEL) {
    throw new Error(
      "Falta conectar un almacenamiento (Vercel Blob) antes de guardar desde el panel.",
    );
  }
  await writeLocal(config);
}
