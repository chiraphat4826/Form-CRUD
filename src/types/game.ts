// src/types/game.ts
export type Game = {
  id: string;
  name: string;
  platform: string;
  hours: number;
  status: "ยังไม่เริ่ม" | "กำลังเล่น" | "เล่นจบแล้ว";
};

// Type สำหรับข้อมูลระหว่างกรอกในฟอร์ม (ทุกฟิลด์เป็น string)
export type GameDraft = {
  name: string;
  platform: string;
  hours: string;
  status: "ยังไม่เริ่ม" | "กำลังเล่น" | "เล่นจบแล้ว";
};