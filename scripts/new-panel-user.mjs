// Genera una entrada nueva para ADMIN_USERS y deja la clave en un archivo temporal.
// Uso: node scripts/new-panel-user.mjs <usuario> "<Nombre>" <rol>
// Imprime solo las rutas. Nunca imprime la clave ni el hash.
import crypto from "node:crypto";
import { writeFileSync } from "node:fs";

const [username, name, role = "editor"] = process.argv.slice(2);

if (!username || !name) {
  console.error('Uso: node scripts/new-panel-user.mjs <usuario> "<Nombre>" <admin|editor|marketing|finance>');
  process.exit(1);
}

const allowed = new Set(["admin", "editor", "marketing", "finance"]);
if (!allowed.has(role)) {
  console.error("Rol inválido. Usa admin, editor, marketing o finance.");
  process.exit(1);
}

const ALPHABET = "abcdefghijkmnopqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ23456789";
const password = Array.from({ length: 16 }, () =>
  ALPHABET[crypto.randomInt(0, ALPHABET.length)],
).join("");

const salt = crypto.randomBytes(16).toString("hex");
const hash = crypto.scryptSync(password, salt, 64).toString("hex");

const passFile = `/tmp/supercasa-${username}.pass`;
const entryFile = `/tmp/supercasa-${username}.json`;

writeFileSync(passFile, password, { mode: 0o600 });
writeFileSync(
  entryFile,
  JSON.stringify({ username, name, role, salt, hash }, null, 2),
  { mode: 0o600 },
);

console.log(`Clave temporal: ${passFile}`);
console.log(`Entrada ADMIN_USERS: ${entryFile}`);
