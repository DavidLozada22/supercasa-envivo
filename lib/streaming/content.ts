import { readJson, writeJson } from "./store";
import { EMPTY_STREAMING_CONTENT, type StreamingContent } from "./merge";

const KEY = "supercasa/streaming-content.json";

export type { SceneOverride, StreamingContent, StreamingCopy } from "./merge";
export {
  mergeScene,
  mergeScenes,
  resolveStreamingCopy,
  DEFAULT_STREAMING_COPY,
  EMPTY_STREAMING_CONTENT,
} from "./merge";

export async function readStreamingContent(): Promise<StreamingContent> {
  const value = await readJson<StreamingContent>(KEY);
  if (!value || typeof value !== "object" || !value.scenes) {
    return EMPTY_STREAMING_CONTENT;
  }
  return value;
}

export async function writeStreamingContent(
  content: StreamingContent,
): Promise<StreamingContent> {
  const next: StreamingContent = {
    ...content,
    updatedAt: new Date().toISOString(),
  };
  await writeJson(KEY, next);
  return next;
}
