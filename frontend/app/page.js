"use client";

import { useEffect, useState } from "react";

export default function Home() {
  const [products, setProducts] = useState([]); // เก็บรายการสินค้า
  const [productName, setProductName] = useState(""); // เก็บชื่อสินค้าที่เลือก
  const [loading, setLoading] = useState(false); // สถานะ Loading
  const [message, setMessage] = useState(""); // ข้อความแจ้งเตือน
  const productOptions = ["Milk Tea", "Thai Tea", "Coco"]; // ตัวเลือกสินค้า

  // ฟังก์ชันโหลดรายการสินค้าจาก Backend
  const fetchProducts = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/orders"); // เชื่อมต่อ API ฝั่ง Backend
      const data = await response.json();
      setProducts(data); // ตั้งค่ารายการสินค้า
    } catch (error) {
      console.error("Failed to fetch products:", error);
    } finally {
      setLoading(false);
    }
  };

  // ฟังก์ชันเพิ่มสินค้าใหม่
  const addProduct = async () => {
    if (!productName) return alert("Please select a product!");
    try {
      const response = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ product_name: productName }),
      });

      if (response.ok) {
        setMessage("Product added successfully!");
        fetchProducts(); // โหลดรายการสินค้าใหม่
        setProductName(""); // รีเซ็ตฟอร์ม
      } else {
        setMessage("Failed to add product.");
        console.error("Failed to add product");
      }
    } catch (error) {
      setMessage("Error adding product.");
      console.error("Error adding product:", error);
    }
  };

  // โหลดรายการสินค้าครั้งแรก
  useEffect(() => {
    fetchProducts();
  }, []);

  return (
    <main className="p-5 max-w-lg mx-auto">
      <h1 className="text-2xl font-bold mb-5">POS System</h1>

      {/* ฟีดแบคข้อความ */}
      {message && (
        <div
          className={`mb-4 p-2 rounded ${
            message.includes("successfully") ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
          }`}
        >
          {message}
        </div>
      )}

      {/* Form สำหรับเลือกสินค้า */}
      <div className="mb-5">
        <label htmlFor="product" className="block font-medium mb-2">
          Select Product:
        </label>
        <select
          id="product"
          value={productName}
          onChange={(e) => setProductName(e.target.value)}
          className="border p-2 w-full"
        >
          <option value="">-- Select --</option>
          {productOptions.map((product) => (
            <option key={product} value={product}>
              {product}
            </option>
          ))}
        </select>
        <button
          onClick={addProduct}
          className="bg-blue-500 text-white px-4 py-2 rounded mt-3"
          disabled={!productName}
        >
          Add Product
        </button>
      </div>

      {/* รายการสินค้า */}
      <div>
        <h2 className="text-xl font-bold mb-3">Product List</h2>
        {loading ? (
          <p>Loading...</p>
        ) : products.length === 0 ? (
          <p>No products available</p>
        ) : (
          <ul className="list-disc pl-5">
            {products.map((product) => (
              <li key={product.id}>
                {product.product_name} -{" "}
                {new Date(product.order_time).toLocaleString("en-US", {
                  timeZone: "Asia/Bangkok",
                  dateStyle: "short",
                  timeStyle: "short",
                })}
              </li>
            ))}
          </ul>
        )}
      </div>
    </main>
  );
}
