import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { BriefingView } from "@/components/briefing-view";
import { PublishedBrief } from "@/components/published-brief";
import briefing from "@/data/briefing";

export const Route = createFileRoute("/")({
  component: Home,
});

function Home() {
  const [view, setView] = useState<"published" | "local">("published");
  return (
    <>
      <div className="mx-auto flex w-full max-w-6xl justify-end px-4 pt-6 md:px-8">
        <div className="flex rounded-2xl bg-surface p-1 shadow-border" role="group" aria-label="Brief">
          <button
            type="button"
            aria-pressed={view === "published"}
            onClick={() => setView("published")}
            className={`rounded-xl px-3 py-1.5 text-sm ${view === "published" ? "bg-bone text-bg" : "text-muted"}`}
          >
            Qwen 3.8
          </button>
          <button
            type="button"
            aria-pressed={view === "local"}
            onClick={() => setView("local")}
            className={`rounded-xl px-3 py-1.5 text-sm ${view === "local" ? "bg-bone text-bg" : "text-muted"}`}
          >
            Local audit
          </button>
        </div>
      </div>
      {view === "published" ? <PublishedBrief /> : <BriefingView briefing={briefing} />}
    </>
  );
}
