import type { Metadata } from "next";
import AnswerBoard from "@/components/answers/AnswerBoard";

export const metadata: Metadata = {
  title: "Respuestas rápidas · La Supercasa",
  description: "Respuestas y mensajes listos para el equipo de WhatsApp de La Supercasa.",
  robots: { index: false, follow: false, nocache: true },
  openGraph: {
    title: "Respuestas rápidas · La Supercasa",
    description: "Panel interno para responder y compartir La Supercasa.",
    images: ["/og-image.jpg"],
  },
};

export default function AnswersPage() {
  return <AnswerBoard />;
}
