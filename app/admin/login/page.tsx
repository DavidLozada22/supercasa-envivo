import { redirect } from "next/navigation";
import LoginForm from "@/components/admin/LoginForm";
import { isAuthenticated } from "@/lib/auth";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Acceso | Panel Supercasa",
};

export default async function LoginPage() {
  if (await isAuthenticated()) redirect("/admin");
  return <LoginForm />;
}
