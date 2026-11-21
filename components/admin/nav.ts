import {
  BarChart3,
  Bell,
  CalendarDays,
  Eye,
  HandCoins,
  LayoutDashboard,
  Map,
  MessageCircle,
  Palette,
  Radio,
  Send,
  Wallet,
} from "lucide-react";
import type { PanelRole } from "@/lib/users";

const ALL: PanelRole[] = ["admin", "editor"];
const CONTENT: PanelRole[] = ["admin", "editor", "marketing"];
const FINANCE: PanelRole[] = ["admin", "finance"];
const EVERYONE: PanelRole[] = ["admin", "editor", "marketing", "finance"];

export type AdminLink = {
  href: string;
  label: string;
  icon: typeof LayoutDashboard;
  description: string;
  roles: PanelRole[];
};

export type AdminGroup = {
  label: string;
  links: AdminLink[];
};

export const ADMIN_GROUPS: AdminGroup[] = [
  {
    label: "Marketing",
    links: [
      {
        href: "/admin/estudio",
        label: "Estudio",
        icon: Palette,
        description: "Creatives, cortinas y overlays con edición y descarga.",
        roles: CONTENT,
      },
    ],
  },
  {
    label: "Producción",
    links: [
      {
        href: "/admin",
        label: "Inicio",
        icon: LayoutDashboard,
        description: "Resumen del evento y ajustes generales.",
        roles: ALL,
      },
      {
        href: "/admin/streaming",
        label: "Streaming",
        icon: Radio,
        description: "Cortinas, OBS, control al aire y estado del live.",
        roles: ALL,
      },
      {
        href: "/admin/programa",
        label: "Programa",
        icon: CalendarDays,
        description: "Los 12 bloques y el minuto a minuto de la escaleta.",
        roles: EVERYONE,
      },
      {
        href: "/respuestas",
        label: "Respuestas WhatsApp",
        icon: MessageCircle,
        description: "Respuestas rápidas y mensajes listos para compartir.",
        roles: EVERYONE,
      },
      {
        href: "/admin/recordatorios",
        label: "Recordatorios",
        icon: Bell,
        description: "Mensajes listos para enviar y lista de inscritos.",
        roles: CONTENT,
      },
      {
        href: "/admin/avisos",
        label: "Avisos",
        icon: Send,
        description: "Mensaje libre con vista previa e historial.",
        roles: CONTENT,
      },
    ],
  },
  {
    label: "Recaudo y casa",
    links: [
      {
        href: "/admin/recaudo",
        label: "Recaudo",
        icon: Wallet,
        description: "Suma de Bre-B, Bancolombia y Wompi, con edición.",
        roles: FINANCE,
      },
      {
        href: "/admin/donaciones",
        label: "Donaciones",
        icon: HandCoins,
        description: "Pagos, confirmaciones y recaudo del evento.",
        roles: ALL,
      },
      {
        href: "/admin/casa",
        label: "Avance de la casa",
        icon: BarChart3,
        description: "Porcentaje construido y metas por habitación.",
        roles: ALL,
      },
    ],
  },
  {
    label: "Sitio",
    links: [
      {
        href: "/admin/recorrido",
        label: "Recorrido",
        icon: Map,
        description: "Mapa y demostración del recorrido de la casa.",
        roles: ALL,
      },
      {
        href: "/admin/preview-home",
        label: "Vista previa",
        icon: Eye,
        description: "Cómo se ve la página pública ahora mismo.",
        roles: ALL,
      },
    ],
  },
];

export const ADMIN_LINKS: AdminLink[] = ADMIN_GROUPS.flatMap((group) => group.links);

export function linksForRole(role: PanelRole | null): AdminLink[] {
  if (!role) return [];
  return ADMIN_LINKS.filter((link) => link.roles.includes(role));
}

export function groupsForRole(role: PanelRole | null): AdminGroup[] {
  if (!role) return [];
  return ADMIN_GROUPS.map((group) => ({
    ...group,
    links: group.links.filter((link) => link.roles.includes(role)),
  })).filter((group) => group.links.length > 0);
}
