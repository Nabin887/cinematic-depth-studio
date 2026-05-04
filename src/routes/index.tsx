import { createFileRoute } from "@tanstack/react-router";
import { CosmicJourney } from "@/components/CosmicJourney";

export const Route = createFileRoute("/")({
  component: CosmicJourney,
  head: () => ({
    meta: [
      { title: "Odyssey — A Cosmic Parallax Journey" },
      { name: "description", content: "Scroll through a cinematic, immersive cosmic journey with layered parallax depth, planets, and galaxies." },
    ],
  }),
});
