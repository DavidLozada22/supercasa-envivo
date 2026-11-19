import { redirect } from "next/navigation";
import AdminShell from "@/components/admin/AdminShell";
import StreamingConsole from "@/components/admin/streaming/StreamingConsole";
import { isAuthenticated } from "@/lib/auth";

export const dynamic = "force-dynamic";

export const metadata = { title: "Streaming" };

export default async function StreamingPage() {
  if (!(await isAuthenticated())) redirect("/admin/login");
  return (
    <AdminShell current="Streaming">
      <StreamingConsole />
    </AdminShell>
  );
}
