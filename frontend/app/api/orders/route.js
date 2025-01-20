import { NextResponse } from 'next/server';

const BACKEND_URL = "http://localhost:8080/orders"; // URL ของ Backend (Go)

// Helper สำหรับ timeout ใน fetch
const fetchWithTimeout = async (url, options, timeout = 5000) => {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeout);
  const response = await fetch(url, { ...options, signal: controller.signal });
  clearTimeout(id);
  return response;
};

// GET Method (ดึงรายการสินค้า)
export async function GET() {
  try {
    const response = await fetchWithTimeout(BACKEND_URL, {}, 5000); // ดึงข้อมูลจาก Backend พร้อม timeout
    if (!response.ok) {
      throw new Error(`Error fetching products: ${response.statusText}`);
    }
    const data = await response.json(); // แปลงเป็น JSON
    return NextResponse.json(data, { status: response.status }); // ส่ง JSON กลับไปที่ Client
  } catch (error) {
    console.error("Error fetching products:", error.message);
    return NextResponse.json(
      { error: "Failed to fetch products", details: error.message },
      { status: 500 }
    );
  }
}

// POST Method (เพิ่มสินค้าใหม่)
export async function POST(req) {
  try {
    const body = await req.json(); // รับข้อมูลจาก Client
    const response = await fetchWithTimeout(
      BACKEND_URL,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      },
      5000 // Timeout 5 วินาที
    );
    if (!response.ok) {
      throw new Error(`Error adding product: ${response.statusText}`);
    }
    const data = await response.json();
    return NextResponse.json(data, { status: response.status }); // ส่งผลลัพธ์กลับไปที่ Client
  } catch (error) {
    console.error("Error adding product:", error.message);
    return NextResponse.json(
      { error: "Failed to add product", details: error.message },
      { status: 500 }
    );
  }
}
