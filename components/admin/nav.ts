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

export const ADMIN_LINKS = [
  { href: "/admin", label: "Panel", icon: LayoutDashboard },
  { href: "/admin/donaciones", label: "Donaciones", icon: HandCoins },
  { href: "/admin/programa", label: "Programa", icon: CalendarDays },
  { href: "/admin/avisos", label: "Avisos", icon: Send },
  { href: "/admin/recorrido", label: "Recorrido", icon: Map },
  { href: "/admin/streaming", label: "Streaming", icon: Radio },
  { href: "/admin/casa", label: "Avance de la casa", icon: BarChart3 },
  { href: "/admin/recordatorios", label: "Recordatorios", icon: Bell },
  { href: "/admin/preview-home", label: "Vista previa en vivo", icon: Eye },
];
