import Link from "next/link";
import type { Game } from "@/types/game";

// กำหนด Type ของ Props ที่คอมโพเนนต์การ์ดนี้รับเข้ามา
type GameCardProps = {
  game: Game;            // ข้อมูลเกม 1 รายการที่จะนำมาแสดงผล
  onEdit: () => void;    // Callback ฟังก์ชันที่ส่งสัญญาณบอก Component แม่ให้เปิดโหมดแก้ไขเกมนี้
  onDelete: () => void;  // Callback ฟังก์ชันที่ส่งสัญญาณบอก Component แม่ให้ลบเกมนี้
};

export default function GameCard({ game, onEdit, onDelete }: GameCardProps) {
  return (
    // ใช้แท็ก <article> ห่อหุ้มข้อมูลเกม 1 การ์ด พร้อมตกแต่งสไตล์ CSS เบื้องต้น (มีเส้นขอบและเว้นระยะห่าง)
    <article style={{ padding: "16px", border: "1px solid #ddd", borderRadius: "8px", marginBottom: "16px" }}>
      
      {/* ส่วนหัวข้อการ์ด (ชื่อเกม) */}
      <h2>
        {/* ใช้ Link ครอบชื่อเกม เมื่อผู้ใช้คลิกจะพุ่งไปที่หน้า Dynamic Route เช่น /games/รหัสเกม โดยไม่โหลดหน้าใหม่[cite: 1] */}
        <Link href={`/games/${game.id}`}>
          {game.name}
        </Link>
      </h2>

      {/* แสดงข้อมูลแพลตฟอร์มที่เล่น */}
      <p>แพลตฟอร์ม: {game.platform}</p>

      {/* แสดงจำนวนชั่วโมงที่เล่น */}
      <p>เวลาที่เล่น: {game.hours} ชั่วโมง</p>

      {/* แสดงสถานะปัจจุบันของเกม */}
      <p>สถานะ: {game.status}</p>
      
      {/* ส่วนของปุ่มกดจัดการข้อมูล */}
      <div>
        {/* ปุ่มแก้ไข: เมื่อผู้ใช้คลิก จะเรียกฟังก์ชัน onEdit ที่รับมาจาก Component แม่ */}
        <button type="button" onClick={onEdit}>แก้ไข</button>
        
        {/* ปุ่มลบ: เมื่อผู้ใช้คลิก จะเรียกฟังก์ชัน onDelete ที่รับมาจาก Component แม่ */}
        <button type="button" onClick={onDelete}>ลบ</button>
      </div>
    </article>
  );
}