export function creativePath(creativeId: string, slideNumber = 1): string {
  const slide = Number.isFinite(slideNumber) && slideNumber > 0 ? Math.round(slideNumber) : 1;
  return `/pantalla/creativo/${encodeURIComponent(creativeId)}?slide=${slide}`;
}
