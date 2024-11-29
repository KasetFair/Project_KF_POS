import { NextResponse } from 'next/server';

const BACKEND_URL = "http://localhost:8080/orders"; // URL ของ Backend (Go)

// GET Method (ดึงรายการสินค้า)
export async function GET() {
  try {
    const response = await fetch(BACKEND_URL); // ดึงข้อมูลจาก Backend
    const data = await response.json(); // แปลงเป็น JSON
    return NextResponse.json(data, { status: response.status }); // ส่ง JSON กลับไปที่ Client
  } catch (error) {
    console.error("Error fetching products:", error);
    return NextResponse.json({ error: "Failed to fetch products" }, { status: 500 });
  }
}

// POST Method (เพิ่มสินค้าใหม่)
export async function POST(req) {
  try {
    const body = await req.json(); // รับข้อมูลจาก Client
    const response = await fetch(BACKEND_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    const data = await response.json();
    return NextResponse.json(data, { status: response.status }); // ส่งผลลัพธ์กลับไปที่ Client
  } catch (error) {
    console.error("Error adding product:", error);
    return NextResponse.json({ error: "Failed to add product" }, { status: 500 });
  }
}
