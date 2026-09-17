"use client";

import { useState, type ChangeEvent, type FormEvent } from "react";
import type { Game, GameDraft } from "@/types/game";

// กำหนดประเภทของ Props ที่ Component นี้รับเข้ามา
type GameFormProps = {
  initialGame?: Game;                    // ข้อมูลเกมเดิม (ถ้ามี แสดงว่ากำลังแก้ไข, ถ้าไม่มีคือเพิ่มใหม่)
  onSave: (draft: GameDraft) => void;    // ฟังก์ชันที่จะทำงานเมื่อกดบันทึกสำเร็จ
  onCancel: () => void;                  // ฟังก์ชันสำหรับกดยกเลิกการแก้ไข
};

// กำหนดค่าเริ่มต้นของฟอร์ม (Draft) ให้ทุกช่องว่างเปล่า
const emptyDraft: GameDraft = {
  name: "",
  platform: "",
  hours: "",
  status: "ยังไม่เริ่ม",
};

// กำหนด Type ของข้อความแจ้งเตือน Error โดยอิงตามคีย์ของ GameDraft
type FormErrors = Partial<Record<keyof GameDraft, string>>;

// ฟังก์ชันแปลงข้อมูลจาก Game (ที่มี number) ให้กลายเป็น GameDraft (ที่เป็น string ทั้งหมดสำหรับใส่ในฟอร์ม)
function toDraft(game?: Game): GameDraft {
  if (!game) {
    return emptyDraft; // ถ้าไม่มีข้อมูลเกมส่งมา ให้ใช้ค่าว่าง
  }
  return {
    name: game.name,
    platform: game.platform,
    hours: String(game.hours), // แปลง number เป็น string ให้เข้ากับช่อง input type text/number
    status: game.status,
  };
}

export default function GameForm({ initialGame, onSave, onCancel }: GameFormProps) {
  // สร้าง State สำหรับเก็บค่าที่ผู้ใช้พิมพ์ในฟอร์ม (เริ่มต้นด้วยค่าแปลงจาก initialGame)
  const [draft, setDraft] = useState<GameDraft>(toDraft(initialGame));
  
  // สร้าง State สำหรับเก็บข้อความ Error ของแต่ละฟิลด์เวลาข้อมูลไม่ผ่านการตรวจสอบ
  const [errors, setErrors] = useState<FormErrors>({});

  // ฟังก์ชันกลางรองรับการเปลี่ยนแปลงข้อมูลทุกช่องอินพุต (ใช้ Computed Property Name)
  function handleChange(event: ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
    const { name, value } = event.target; // ดึงชื่อฟิลด์ (name) และค่าที่พิมพ์ (value) ออกมา
    setDraft((prev) => ({ ...prev, [name]: value })); // อัปเดต State เฉพาะฟิลด์ที่เปลี่ยน โดยคงค่าเก่าตัวอื่นไว้
  }

  // ฟังก์ชันตรวจสอบความถูกต้องของข้อมูล (Validation)
  function validate(value: GameDraft): FormErrors {
    const nextErrors: FormErrors = {};
    
    // เช็คว่าชื่อเกมว่างไหม (ตัดช่องว่างหัวท้ายออกก่อน)
    if (value.name.trim() === "") {
      nextErrors.name = "กรุณาระบุชื่อเกม";
    }
    
    // เช็คว่าแพลตฟอร์มว่างไหม
    if (value.platform.trim() === "") {
      nextErrors.platform = "กรุณาระบุแพลตฟอร์ม";
    }
    
    // แปลงชั่วโมงเป็นตัวเลข แล้วเช็คว่าเป็นจำนวนเต็มบวกหรือศูนย์หรือไม่
    const hours = Number(value.hours);
    if (!Number.isInteger(hours) || hours < 0) {
      nextErrors.hours = "จำนวนชั่วโมงต้องเป็นจำนวนเต็มบวกหรือศูนย์";
    }
    
    return nextErrors; // คืนค่าอ็อบเจกต์เก็บข้อความ Error (ถ้าไม่มี error จะเป็นอ็อบเจกต์ว่าง)
  }

  // ฟังก์ชันทำงานเมื่อผู้ใช้กดปุ่มบันทึก (Submit Form)
  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); // ป้องกันไม่ให้เว็บรีเฟรชเองตามพฤติกรรมเริ่มต้นของ HTML
    
    const nextErrors = validate(draft); // สั่งรันฟังก์ชันตรวจสอบข้อมูล
    setErrors(nextErrors); // เอาผลลัพธ์ Error ไปเก็บลง State

    // ถ้าตรวจสอบแล้วพบ Error อย่างน้อย 1 ช่อง (ความยาวอ็อบเจกต์มากกว่า 0) ให้หยุดการทำงานทันที
    if (Object.keys(nextErrors).length > 0) {
      return;
    }

    onSave(draft);         // ถ้าผ่าน ส่งข้อมูลฟอร์มกลับไปให้ Component แม่ผ่าน Callback Prop
    setDraft(emptyDraft);  // ล้างฟอร์มให้กลับมาว่างเปล่า
    setErrors({});         // ล้างข้อความ Error ทั้งหมดทิ้ง
  }

  return (
    // ฟอร์มหลัก ผูกกับ handleSubmit และปิดการตรวจสอบอัตโนมัติของเบราว์เซอร์ด้วย noValidate
    <form onSubmit={handleSubmit} noValidate style={{ marginBottom: "32px", padding: "20px", border: "1px solid #ccc", borderRadius: "8px" }}>
      
      {/* หัวข้อฟอร์ม จะเปลี่ยนข้อความอัตโนมัติตามโหมด (แก้ไข หรือ เพิ่มใหม่) */}
      <h2>{initialGame ? "แก้ไขข้อมูลเกม" : "เพิ่มเกมใหม่"}</h2>

      {/* ช่องกรอกชื่อเกม */}
      <div style={{ marginBottom: "12px" }}>
        <label htmlFor="name">ชื่อเกม: </label>
        <input
          id="name"
          name="name"
          type="text"
          value={draft.name}
          onChange={handleChange}
          aria-invalid={!!errors.name} // แจ้ง Screen Reader หากช่องนี้กรอกผิด
        />
        {/* แสดงข้อความ Error สีแดง ถ้าฟิลด์ name มีปัญหา */}
        {errors.name && <p style={{ color: "red", fontSize: "14px" }}>{errors.name}</p>}
      </div>

      {/* ช่องกรอกแพลตฟอร์ม */}
      <div style={{ marginBottom: "12px" }}>
        <label htmlFor="platform">แพลตฟอร์ม: </label>
        <input
          id="platform"
          name="platform"
          type="text"
          value={draft.platform}
          onChange={handleChange}
          aria-invalid={!!errors.platform}
        />
        {errors.platform && <p style={{ color: "red", fontSize: "14px" }}>{errors.platform}</p>}
      </div>

      {/* ช่องกรอกชั่วโมงที่เล่น */}
      <div style={{ marginBottom: "12px" }}>
        <label htmlFor="hours">ชั่วโมงที่เล่น: </label>
        <input
          id="hours"
          name="hours"
          type="number"
          inputMode="numeric"
          min="0"
          value={draft.hours}
          onChange={handleChange}
          aria-invalid={!!errors.hours}
        />
        {errors.hours && <p style={{ color: "red", fontSize: "14px" }}>{errors.hours}</p>}
      </div>

      {/* ช่องเลือกสถานะเกม (Dropdown) */}
      <div style={{ marginBottom: "12px" }}>
        <label htmlFor="status">สถานะ: </label>
        <select id="status" name="status" value={draft.status} onChange={handleChange}>
          <option value="ยังไม่เริ่ม">ยังไม่เริ่ม</option>
          <option value="กำลังเล่น">กำลังเล่น</option>
          <option value="เล่นจบแล้ว">เล่นจบแล้ว</option>
        </select>
      </div>

      {/* ปุ่มกดบันทึกข้อมูล */}
      <button type="submit" style={{ marginRight: "8px" }}>บันทึก</button>
      
      {/* ปุ่มยกเลิก จะแสดงผลเฉพาะตอนที่อยู่ในโหมดแก้ไข (initialGame มีค่า) เท่านั้น */}
      {initialGame && (
        <button type="button" onClick={onCancel}>
          ยกเลิก
        </button>
      )}
    </form>
  );
}