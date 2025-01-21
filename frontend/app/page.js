"use client";

import { useState } from "react";

export default function Home() {
  const productOptions = [
    { name: "Thai Tea", price: 50 },
    { name: "Milk Tea", price: 50 },
    { name: "Coco", price: 50 },
  ]; // สินค้าและราคาต่อหน่วย

  const [quantities, setQuantities] = useState(
    productOptions.reduce((acc, product) => ({ ...acc, [product.name]: 0 }), {})
  ); // เก็บจำนวนสินค้าของแต่ละประเภท
  const [total, setTotal] = useState(0); // ราคารวม

  // ฟังก์ชันเพิ่มจำนวนสินค้า
  const increaseQuantity = (productName) => {
    setQuantities((prev) => {
      const updated = { ...prev, [productName]: prev[productName] + 1 };
      calculateTotal(updated);
      return updated;
    });
  };

  // ฟังก์ชันลดจำนวนสินค้า
  const decreaseQuantity = (productName) => {
    setQuantities((prev) => {
      if (prev[productName] <= 0) return prev; // ไม่ให้ลดต่ำกว่า 0
      const updated = { ...prev, [productName]: prev[productName] - 1 };
      calculateTotal(updated);
      return updated;
    });
  };

  // คำนวณราคารวม
  const calculateTotal = (quantities) => {
    const totalPrice = productOptions.reduce(
      (sum, product) => sum + quantities[product.name] * product.price,
      0
    );
    setTotal(totalPrice);
  };

  return (
    <main className="p-5 max-w-lg mx-auto">
      <h1 className="text-2xl font-bold mb-5">POS System</h1>

      {/* รายการสินค้า */}
      <div>
        {productOptions.map((product) => (
          <div
            key={product.name}
            className="flex items-center justify-between mb-4 border-b pb-2"
          >
            <span className="font-medium">{product.name}</span>
            <div className="flex items-center">
              <button
                onClick={() => decreaseQuantity(product.name)}
                className="bg-red-500 text-white px-3 py-1 rounded-l"
              >
                -
              </button>
              <span className="px-4">{quantities[product.name]}</span>
              <button
                onClick={() => increaseQuantity(product.name)}
                className="bg-green-500 text-white px-3 py-1 rounded-r"
              >
                +
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* แสดงราคารวม */}
      <div className="mt-5 text-lg font-bold">
        Total: {total.toLocaleString()} ฿
      </div>
    </main>
  );
}
