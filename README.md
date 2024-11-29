ด้านล่างนี้เป็นไฟล์ `README.md` ที่คุณสามารถคัดลอกไปใส่ในโปรเจกต์ของคุณได้โดยตรง:

---

```markdown
# POS System

โปรเจกต์นี้คือระบบ **Point of Sale (POS)** ที่พัฒนาขึ้นเพื่อให้ผู้ใช้สามารถเลือกสินค้า (เช่น Milk Tea, Thai Tea, Coco) เพิ่มคำสั่งซื้อ และดูรายการสินค้าทั้งหมด โดยระบบถูกพัฒนาด้วย **Frontend (Next.js)** และ **Backend (Go)** พร้อมเชื่อมต่อกับฐานข้อมูล **PostgreSQL**

---

## โครงสร้างโปรเจกต์

```plaintext
POS System/
├── backend/                 # Backend สำหรับ API (Go)
│   ├── db/                  # การตั้งค่าการเชื่อมต่อฐานข้อมูล
│   │   └── connection.go
│   ├── handlers/            # API Handlers
│   │   └── order_handlers.go
│   ├── models/              # โครงสร้างข้อมูล (Models)
│   │   └── order.go
│   ├── main.go              # Entry point สำหรับรันเซิร์ฟเวอร์
│   ├── go.mod               # Go Modules Configuration
│   └── go.sum               # Go Modules Dependencies
├── frontend/                # Frontend (Next.js)
│   ├── app/
│   │   ├── page.tsx         # หน้าหลักของระบบ
│   │   └── api/
│   │       └── orders/
│   │           └── route.ts # API เชื่อมต่อ Backend
│   ├── components/          # Reusable Components
│   │   ├── ProductForm.tsx  # ฟอร์มเลือกสินค้า
│   │   └── ProductList.tsx  # แสดงรายการสินค้า
│   ├── styles/
│   │   └── globals.css      # สไตล์หลักของโปรเจกต์
│   └── package.json         # ข้อมูล Dependencies สำหรับ Frontend
├── database/                # ไฟล์ SQL สำหรับตั้งค่าฐานข้อมูล
│   └── init.sql
└── README.md                # คำอธิบายโปรเจกต์ (ไฟล์นี้)
```

---

## ฟีเจอร์

1. **เพิ่มสินค้าใหม่**: ให้ผู้ใช้เลือกสินค้า (Milk Tea, Thai Tea, Coco) และเพิ่มลงในฐานข้อมูล.
2. **แสดงรายการสินค้า**: ดูรายการคำสั่งซื้อทั้งหมด พร้อมวันที่และเวลาที่บันทึก.
3. **บันทึกเวลาในเขตเวลาประเทศไทย (Asia/Bangkok)**: เวลา `order_time` ถูกบันทึกในฐานข้อมูลด้วยเขตเวลาไทย.

---

## วิธีการติดตั้ง

### 1. Clone โปรเจกต์
```bash
git clone https://github.com/<your-repository>.git
cd POS-System
```

---

### 2. ตั้งค่าฝั่ง Backend

#### 2.1 ติดตั้ง Go Modules
เข้าไปที่โฟลเดอร์ `backend` และรันคำสั่ง:
```bash
cd backend
go mod tidy
```

#### 2.2 สร้างฐานข้อมูล
1. สร้างฐานข้อมูล PostgreSQL ชื่อ `pos_db`.
2. ใช้ไฟล์ `database/init.sql` เพื่อตั้งค่าตาราง:
   ```sql
   CREATE TABLE orders (
       id SERIAL PRIMARY KEY,
       product_name VARCHAR(100) NOT NULL,
       order_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP
   );
   ```

#### 2.3 ตั้งค่าการเชื่อมต่อฐานข้อมูล
แก้ไขไฟล์ `db/connection.go`:
```go
const connStr = "postgresql://<username>:<password>@localhost:<port>/pos_db?sslmode=disable"
```

#### 2.4 รันเซิร์ฟเวอร์ Backend
รันคำสั่ง:
```bash
go run main.go
```
เซิร์ฟเวอร์จะเริ่มต้นที่ `http://localhost:8080`.

---

### 3. ตั้งค่าฝั่ง Frontend

#### 3.1 ติดตั้ง Dependencies
เข้าไปที่โฟลเดอร์ `frontend` และรันคำสั่ง:
```bash
cd frontend
npm install
```

#### 3.2 รันเซิร์ฟเวอร์ Frontend
รันคำสั่ง:
```bash
npm run dev
```
Frontend จะเริ่มต้นที่ `http://localhost:3000`.

---

## วิธีใช้งาน

1. เปิดเบราว์เซอร์และไปที่ `http://localhost:3000`.
2. เลือกสินค้าใน Dropdown (Milk Tea, Thai Tea, Coco) แล้วคลิก **Add Product**.
3. ดูรายการสินค้าทั้งหมดในส่วน Product List.

---

## API Endpoints

### 1. Backend API
| Method | Endpoint    | Description              |
|--------|-------------|--------------------------|
| GET    | /orders     | ดึงรายการสินค้า          |
| POST   | /orders     | เพิ่มสินค้าใหม่          |

### 2. Frontend API (Next.js)
| Method | Endpoint        | Description              |
|--------|-----------------|--------------------------|
| GET    | /api/orders     | เชื่อมต่อกับ Backend (GET) |
| POST   | /api/orders     | เชื่อมต่อกับ Backend (POST) |

---

## Dependencies

### Backend
- Go 1.20+
- PostgreSQL
- Gorilla Mux (`github.com/gorilla/mux`)

### Frontend
- Node.js 18+
- Next.js 15+
- TailwindCSS

---

## ภาพรวมการทำงาน

- **Frontend**: ผู้ใช้สามารถเลือกสินค้าและส่งข้อมูลผ่าน API.
- **Backend**: จัดการข้อมูลสินค้าในฐานข้อมูล และส่งผลลัพธ์กลับในรูปแบบ JSON.
- **Database**: บันทึกคำสั่งซื้อ พร้อมวันที่และเวลาของประเทศไทย.

---
