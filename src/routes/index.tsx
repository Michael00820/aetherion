import { createFileRoute } from "@tanstack/react-router";
import { Cosmos } from "@/components/Cosmos";

export const Route = createFileRoute("/")({
  component: Home,
});

function Home() {
  return <Cosmos />;
}
