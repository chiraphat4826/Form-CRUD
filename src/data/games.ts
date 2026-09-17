// src/data/games.ts
import type { Game } from "@/types/game";

export const games: Game[] = [
  {
    id: "game-1",
    name: "The Legend of Zelda: Breath of the Wild",
    platform: "Nintendo Switch",
    hours: 50,
    status: "เล่นจบแล้ว",
  },
  {
    id: "game-2",
    name: "Elden Ring",
    platform: "PC",
    hours: 80,
    status: "กำลังเล่น",
  },
  {
    id: "game-3",
    name: "Cyberpunk 2077",
    platform: "PC",
    hours: 0,
    status: "ยังไม่เริ่ม",
  },
  {
    id: "game-4",
    name: "Hades",
    platform: "PC",
    hours: 35,
    status: "เล่นจบแล้ว",
  },
  {
    id: "game-5",
    name: "Stardew Valley",
    platform: "Nintendo Switch",
    hours: 20,
    status: "กำลังเล่น",
  },
];