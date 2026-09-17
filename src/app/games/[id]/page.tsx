// src/app/games/[id]/page.tsx
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { games } from "@/data/games";

type GamePageProps = {
  params: Promise<{ id: string }>;
};

// กำหนด Metadata ตามชื่อเกมจริง
export async function generateMetadata({ params }: GamePageProps): Promise<Metadata> {
  const { id } = await params;
  const game = games.find((item) => item.id === id);
  return {
    title: game ? game.name : "ไม่พบข้อมูลเกม",
  };
}

export default async function GamePage({ params }: GamePageProps) {
  const { id } = await params;
  const game = games.find((item) => item.id === id);

  if (!game) {
    notFound();
  }

  return (
    <main style={{ maxWidth: "600px", margin: "40px auto", padding: "20px", border: "1px solid #ccc", borderRadius: "8px" }}>
      <h1>{game.name}</h1>
      <p>🎮 <strong>แพลตฟอร์ม:</strong> {game.platform}</p>
      <p>⏱️ <strong>เวลาที่คาดว่าจะใช้เล่น:</strong> {game.hours} ชั่วโมง</p>
      <p>📌 <strong>สถานะ:</strong> {game.status}</p>
    </main>
  );
}