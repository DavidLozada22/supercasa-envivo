import { dbClient } from "@/lib/donations/store";

export async function addReminder(input: {
  email: string;
  name?: string | null;
  source?: string;
  ref?: string | null;
}): Promise<void> {
  const db = dbClient();
  if (!db) return;
  await db`
    insert into reminders (email, name, consent, source, ref_code)
    values (
      ${input.email.slice(0, 254)},
      ${input.name?.slice(0, 80) || null},
      true,
      ${input.source?.slice(0, 40) || "donacion"},
      ${input.ref?.slice(0, 60) || null}
    )
    on conflict (lower(email)) do nothing
  `;
}
