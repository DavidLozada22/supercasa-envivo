import {
  BarChart3,
  Bell,
  CalendarDays,
  Eye,
  HandCoins,
  LayoutDashboard,
  Map,
  Radio,
  Send,
} from "lucide-react";

export type AdminLink = {
  href: string;
  label: string;
  icon: typeof LayoutDashboard;
  description: string;
};

export type AdminGroup = {
  label: string;
  links: AdminLink[];
};

export const ADMIN_GROUPS: AdminGroup[] = [
  {
    label: "Producción",
    links: [
      {
        href: "/admin",
        label: "Inicio",
        icon: LayoutDashboard,
        description: "Resumen del evento y ajustes generales.",
      },
      {
        href: "/admin/streaming",
        label: "Streaming",
        icon: Radio,
        description: "Cortinas, OBS, control al aire y estado del live.",
      },
      {
        href: "/admin/programa",
        label: "Programa",
        icon: CalendarDays,
        description: "Los 12 bloques y el minuto a minuto de la escaleta.",
      },
      {
        href: "/admin/recordatorios",
        label: "Recordatorios",
        icon: Bell,
        description: "Mensajes listos para enviar y lista de inscritos.",
      },
      {
        href: "/admin/avisos",
        label: "Avisos",
        icon: Send,
        description: "Mensaje libre con vista previa e historial.",
      },
    ],
  },
  {
    label: "Recaudo y casa",
    links: [
      {
        href: "/admin/donaciones",
        label: "Donaciones",
        icon: HandCoins,
        description: "Pagos, confirmaciones y recaudo del evento.",
      },
      {
        href: "/admin/casa",
        label: "Avance de la casa",
        icon: BarChart3,
        description: "Porcentaje construido y metas por habitación.",
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
      },
      {
        href: "/admin/preview-home",
        label: "Vista previa",
        icon: Eye,
        description: "Cómo se ve la página pública ahora mismo.",
      },
    ],
  },
];

export const ADMIN_LINKS: AdminLink[] = ADMIN_GROUPS.flatMap((group) => group.links);
