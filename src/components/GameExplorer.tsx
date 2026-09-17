"use client";

import { useState, type ChangeEvent } from "react";
import type { Game, GameDraft } from "@/types/game";
import GameCard from "@/components/GameCard";
import GameForm from "@/components/GameForm";

// กำหนด Type ของ Props ที่รับเข้ามา 
type GameExplorerProps = {
  initialGames: Game[];
};

export default function GameExplorer({ initialGames }: GameExplorerProps) {
  // 1. ประกาศ State หลักของระบบ[cite: 1]
  const [games, setGames] = useState<Game[]>(initialGames);       // เก็บรายการเกมทั้งหมดในระบบ
  const [keyword, setKeyword] = useState("");                     // เก็บคำค้นหาจากช่อง Search
  const [editingId, setEditingId] = useState<string | null>(null); // เก็บรหัส (id) ของเกมที่กำลังแก้ไขอยู่

  // 2. ฟังก์ชันสร้างเกมใหม่ 
  function handleCreate(draft: GameDraft) {
    const newGame: Game = {
      id: crypto.randomUUID(),           // สุ่มรหัส ID ไม่ซ้ำกัน
      name: draft.name.trim(),           // ตัดช่องว่างหัวท้ายชื่อเกมออก
      platform: draft.platform.trim(),   // ตัดช่องว่างหัวท้ายแพลตฟอร์ม
      hours: Number(draft.hours),        // แปลงชั่วโมงจาก string ให้เป็น number
      status: draft.status,              // กำหนดสถานะเกม
    };
    setGames([...games, newGame]);       // อัปเดต State คัดลอกของเดิมทั้งหมด แล้วต่อท้ายด้วยตัวใหม่
  }

  // 3. ฟังก์ชันลบเกม (Delete)
  function handleDelete(id: string) {
    // กรองเอาเฉพาะเกมที่มี id ไม่ตรงกับตัวที่จะลบ เก็บไว้ (ตัวที่ตรงจะถูกตัดทิ้ง)
    setGames(games.filter((game) => game.id !== id));
  }

  // 4. ฟังก์ชันอัปเดตข้อมูลเกม (Update)
  function handleUpdate(id: string, draft: GameDraft) {
    setGames(
      games.map((game) =>
        game.id === id
          ? {
              ...game,                     // คัดลอกข้อมูลเก่าของเกมนั้นมาก่อน
              name: draft.name.trim(),     // ทับด้วยชื่อใหม่ที่แก้ไข
              platform: draft.platform.trim(), // ทับด้วยแพลตฟอร์มใหม่
              hours: Number(draft.hours),  // แปลงชั่วโมงเป็น number
              status: draft.status,        // ทับด้วยสถานะใหม่
            }
          : game                           
      )
    );
    setEditingId(null); 
  }

  // 5. ฟังก์ชันกลางสำหรับกดบันทึก (แยกระหว่างสร้างใหม่ หรือ แก้ไขเดิม)
  function handleSave(draft: GameDraft) {
    if (editingId === null) {
      handleCreate(draft); 
      return;
    }
    handleUpdate(editingId, draft); 
  }

  // 6. ระบบค้นหาเกมแบบ Real-time 
  const searchText = keyword.trim().toLowerCase();
  const visibleGames = games.filter(
    (game) =>
      game.name.toLowerCase().includes(searchText) ||
      game.platform.toLowerCase().includes(searchText)
  );

  // ฟังก์ชันดึงค่าเวลาพิมพ์ค้นหาในช่อง
  function handleKeywordChange(event: ChangeEvent<HTMLInputElement>) {
    setKeyword(event.target.value);
  }

  // ค้นหาข้อมูลเกมตัวที่กำลังถูกเลือกแก้ไขอยู่ เพื่อส่งต่อให้ฟอร์ม
  const editingGame = games.find((game) => game.id === editingId);

  return (
    <div style={{ maxWidth: "800px", margin: "0 auto", padding: "20px" }}>
      <h1>🎮 Game Backlog รายการเกมที่อยากเล่น</h1>

      {/* ช่องสำหรับพิมพ์ค้นหาเกม */}
      <div style={{ marginBottom: "24px" }}>
        <input
          type="search"
          placeholder="ค้นหาชื่อเกมหรือแพลตฟอร์ม..."
          value={keyword}
          onChange={handleKeywordChange}
          style={{ width: "100%", padding: "10px", fontSize: "16px", borderRadius: "4px", border: "1px solid #ccc" }}
        />
      </div>

      {/* คอมโพเนนต์ฟอร์ม (ใช้ร่วมกันทั้งโหมดเพิ่ม และโหมดแก้ไข)[cite: 1] */}
      <GameForm
        key={editingId ?? "new"} // บังคับให้รีเซ็ตฟอร์มใหม่เมื่อสลับโหมด[cite: 1]
        initialGame={editingGame} // ส่งข้อมูลเกมเดิมเข้าไป (ถ้ามี)[cite: 1]
        onSave={handleSave}       // ส่ง callback ฟังก์ชันบันทึก[cite: 1]
        onCancel={() => setEditingId(null)} // ส่ง callback ปุ่มยกเลิก[cite: 1]
      />

      {/* เงื่อนไขการแสดงผล: ถ้าค้นหาไม่พบ ให้แสดงข้อความแจ้งเตือน แต่ถ้ามีให้วนลูปแสดงการ์ดเกม[cite: 1] */}
      {visibleGames.length === 0 ? (
        <p style={{ textAlign: "center", color: "#666" }}>ไม่พบรายการเกมที่ค้นหา</p>
      ) : (
        <div>
          {visibleGames.map((game) => (
            <GameCard
              key={game.id} // กำหนด key ด้วย id ที่ไม่ซ้ำกันตามหลัก React[cite: 1]
              game={game}
              onEdit={() => setEditingId(game.id)}       // เมื่อกดแก้ไข ให้ตั้งค่า editingId เป็นเกมนี้[cite: 1]
              onDelete={() => handleDelete(game.id)}     // เมื่อกดลบ ให้เรียกฟังก์ชันลบตาม id[cite: 1]
            />
          ))}
        </div>
      )}
    </div>
  );
}