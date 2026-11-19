import { redirect } from "next/navigation";
import { isAuthenticated } from "@/lib/auth";
import FlowDemo from "@/components/admin/FlowDemo";

export const dynamic = "force-dynamic";

export default async function FlowPage() {
  if (!(await isAuthenticated())) redirect("/admin/login");
  return <FlowDemo />;
}
