import {
  BarChart3,
  HandCoins,
  LayoutDashboard,
  Map,
  Radio,
} from "lucide-react";

export const ADMIN_LINKS = [
  { href: "/admin", label: "Panel", icon: LayoutDashboard },
  { href: "/admin/donaciones", label: "Donaciones", icon: HandCoins },
  { href: "/admin/recorrido", label: "Recorrido", icon: Map },
  { href: "/admin/cortina", label: "Cortinas del live", icon: Radio },
  { href: "/admin/casa", label: "Avance de la casa", icon: BarChart3 },
];
