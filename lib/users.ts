import crypto from "node:crypto";

export type PanelRole = "admin" | "editor" | "marketing" | "finance";

export type PanelUser = {
  username: string;
  name: string;
  role: PanelRole;
};

type StoredUser = PanelUser & { salt: string; hash: string };

const KEY_LENGTH = 64;

function derive(password: string, salt: string): Buffer {
  return crypto.scryptSync(password, salt, KEY_LENGTH);
}

export function hashPassword(
  password: string,
  salt = crypto.randomBytes(16).toString("hex"),
): { salt: string; hash: string } {
  return { salt, hash: derive(password, salt).toString("hex") };
}

function parseUsers(): StoredUser[] {
  const raw = process.env.ADMIN_USERS;
  if (raw) {
    try {
      const parsed = JSON.parse(raw) as StoredUser[];
      if (Array.isArray(parsed)) {
        return parsed.filter(
          (user) =>
            typeof user?.username === "string" &&
            typeof user?.salt === "string" &&
            typeof user?.hash === "string",
        );
      }
    } catch {
      return [];
    }
  }

  if (process.env.ADMIN_PASSWORD) {
    return [
      {
        username: "admin",
        name: "Administrador",
        role: "admin",
        ...hashPassword(process.env.ADMIN_PASSWORD, "legacy-admin-salt"),
      },
    ];
  }

  if (process.env.NODE_ENV !== "production") {
    return [
      {
        username: "nelson",
        name: "Nelson",
        role: "admin",
        ...hashPassword("supercasa2026", "dev-salt-supercasa"),
      },
    ];
  }

  return [];
}

export function listUsers(): PanelUser[] {
  return parseUsers().map(({ username, name, role }) => ({ username, name, role }));
}

export function findUser(username: string): StoredUser | null {
  const normalized = username.trim().toLowerCase();
  return (
    parseUsers().find((user) => user.username.toLowerCase() === normalized) ?? null
  );
}

export function roleOf(username: string): PanelRole | null {
  return findUser(username)?.role ?? null;
}

export async function verifyUser(
  username: string,
  password: string,
): Promise<PanelUser | null> {
  const user = findUser(username);
  if (!user || !password) return null;

  const candidate = derive(password, user.salt);
  const stored = Buffer.from(user.hash, "hex");
  if (candidate.length !== stored.length) return null;

  if (!crypto.timingSafeEqual(candidate, stored)) return null;
  return { username: user.username, name: user.name, role: user.role };
}
