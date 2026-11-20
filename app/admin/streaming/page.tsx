import AdminShell from "@/components/admin/AdminShell";
import StreamingConsole from "@/components/admin/streaming/StreamingConsole";
import { requirePageRole } from "@/lib/permissions";
import { readStreamingContent } from "@/lib/streaming/content";
import { readProgram } from "@/lib/program/store";

export const dynamic = "force-dynamic";

export const metadata = { title: "Streaming" };

export default async function StreamingPage() {
  await requirePageRole(["admin", "editor"]);
  const [content, program] = await Promise.all([readStreamingContent(), readProgram()]);
  return (
    <AdminShell current="Streaming">
      <StreamingConsole content={content} program={program} />
    </AdminShell>
  );
}
