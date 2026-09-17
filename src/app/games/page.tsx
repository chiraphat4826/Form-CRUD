// src/app/games/page.tsx
import type { Metadata } from "next";
import { games } from "@/data/games";
import GameExplorer from "@/components/GameExplorer";

export const metadata: Metadata = {
  title: "รายการเกมทั้งหมด (Game Backlog)",
};

export default function GamesPage() {
  return (
    <main>
      <GameExplorer initialGames={games} />
    </main>
  );
}