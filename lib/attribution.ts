export type Attribution = {
  source?: string;
  medium?: string;
  campaign?: string;
  content?: string;
  term?: string;
  ref?: string;
};

const clean = (value: unknown, max = 120) =>
  typeof value === "string" ? value.trim().slice(0, max) || undefined : undefined;

export function normalizeAttribution(input: unknown): Attribution {
  const data = (input ?? {}) as Record<string, unknown>;
  return {
    source: clean(data.source),
    medium: clean(data.medium),
    campaign: clean(data.campaign),
    content: clean(data.content),
    term: clean(data.term),
    ref: clean(data.ref, 60),
  };
}

export function hasAttribution(attribution: Attribution): boolean {
  return Boolean(attribution.source || attribution.medium || attribution.campaign || attribution.ref);
}
