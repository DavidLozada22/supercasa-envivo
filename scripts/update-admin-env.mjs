// Agrega un usuario al ADMIN_USERS de Vercel sin imprimir valores.
// Uso: VERCEL_TOKEN=... node scripts/update-admin-env.mjs /tmp/usuario.json
import { readFileSync } from "node:fs";

const token = process.env.VERCEL_TOKEN;
const project = "prj_LZcglUGwf5Dvrxh71n7QQJ0S2RNP";
const team = "team_8DOr5cSxa6pvpsgAlkIlUvfu";
const file = process.argv[2];

if (!token) {
  console.error("Falta VERCEL_TOKEN.");
  process.exit(1);
}
if (!file) {
  console.error("Falta el JSON del usuario.");
  process.exit(1);
}

const user = JSON.parse(readFileSync(file, "utf8"));
const replace = process.argv.includes("--replace");

async function api(path, init = {}) {
  const separator = path.includes("?") ? "&" : "?";
  const response = await fetch(`https://api.vercel.com${path}${separator}teamId=${team}`, {
    ...init,
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
      ...(init.headers ?? {}),
    },
  });
  const body = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(
      `${response.status} ${body?.error?.code ?? body?.error?.message ?? "Vercel rechazó la solicitud"}`,
    );
  }
  return body;
}

const listing = await api(`/v9/projects/${project}/env`);
const envs = (listing.envs ?? []).filter((env) => env.key === "ADMIN_USERS");
if (envs.length === 0) {
  throw new Error("No existe ADMIN_USERS en el proyecto.");
}

for (const env of envs) {
  const detail = await api(`/v9/projects/${project}/env/${env.id}?decrypt=true`);
  let users;
  try {
    users = JSON.parse(detail.value ?? "[]");
  } catch {
    throw new Error(`ADMIN_USERS de ${env.target.join(",")} no es JSON válido.`);
  }
  if (!Array.isArray(users)) throw new Error("ADMIN_USERS no es una lista.");

  const exists = users.some(
    (item) => String(item?.username ?? "").toLowerCase() === user.username.toLowerCase(),
  );
  if (exists && !replace) {
    console.log(`Ya existe en ${env.target.join(",")}. No se tocó.`);
    continue;
  }

  const next = exists
    ? users.map((item) =>
        String(item?.username ?? "").toLowerCase() === user.username.toLowerCase() ? user : item,
      )
    : [...users, user];
  await api(`/v9/projects/${project}/env/${env.id}`, {
    method: "PATCH",
    body: JSON.stringify({ value: JSON.stringify(next) }),
  });
  console.log(`OK ${env.target.join(",")}: ${users.length} -> ${next.length} usuarios.`);
}
