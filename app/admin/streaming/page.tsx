import AdminShell from "@/components/admin/AdminShell";
import StreamingConsole from "@/components/admin/streaming/StreamingConsole";
import { requirePageRole } from "@/lib/permissions";

export const dynamic = "force-dynamic";

export const metadata = { title: "Streaming" };

export default async function StreamingPage() {
  await requirePageRole(["admin", "editor"]);
  return (
    <AdminShell current="Streaming">
      <StreamingConsole />
    </AdminShell>
  );
}
