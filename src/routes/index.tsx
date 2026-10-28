import { createFileRoute } from "@tanstack/react-router";
import { BriefingView } from "@/components/briefing-view";
import briefing from "@/data/briefing";

export const Route = createFileRoute("/")({
  component: Home,
});

function Home() {
  return <BriefingView briefing={briefing} />;
}
