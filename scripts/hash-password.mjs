# Genera una entrada para ADMIN_USERS leyendo la clave por stdin.
#
#   node scripts/hash-password.mjs nelson "Nelson"
#   (pide la clave sin mostrarla en el historial)
#
# Imprime solo el objeto JSON con salt y hash. No guarda la clave.

import crypto from "node:crypto";
import readline from "node:readline";

const [username, name] = process.argv.slice(2);

if (!username) {
  console.error("Uso: node scripts/hash-password.mjs <usuario> [nombre]");
  process.exit(1);
}

const rl = readline.createInterface({ input: process.stdin, output: process.stdout });

rl.question("Clave: ", (password) => {
  rl.close();
  if (!password) {
    console.error("La clave no puede estar vacia.");
    process.exit(1);
  }

  const salt = crypto.randomBytes(16).toString("hex");
  const hash = crypto.scryptSync(password, salt, 64).toString("hex");

  console.log(
    JSON.stringify({
      username,
      name: name ?? username,
      role: "admin",
      salt,
      hash,
    }),
  );
});
