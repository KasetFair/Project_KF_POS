package handlers

import (
	"backend/db"
	"backend/models"
	"encoding/json"
	"net/http"
	"time"
)

// Handler สำหรับดึงข้อมูลสินค้า (GET)
func GetOrdersHandler(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodGet {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	// ดึงข้อมูลจากฐานข้อมูล
	rows, err := db.DB.Query("SELECT id, product_name, order_time FROM orders")
	if err != nil {
		http.Error(w, "Failed to fetch orders", http.StatusInternalServerError)
		return
	}
	defer rows.Close()

	// สร้างรายการสินค้า
	var orders []models.Order
	for rows.Next() {
		var order models.Order
		if err := rows.Scan(&order.ID, &order.ProductName, &order.OrderTime); err != nil {
			http.Error(w, "Failed to parse orders", http.StatusInternalServerError)
			return
		}
		orders = append(orders, order)
	}

	// ส่งข้อมูลกลับในรูปแบบ JSON
	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(orders)
}

func CreateOrderHandler(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	// อ่านข้อมูลจาก Body
	var order models.Order
	if err := json.NewDecoder(r.Body).Decode(&order); err != nil {
		http.Error(w, "Invalid input", http.StatusBadRequest)
		return
	}

	// โหลดเขตเวลา Asia/Bangkok
	location, err := time.LoadLocation("Asia/Bangkok")
	if err != nil {
		http.Error(w, "Failed to load timezone", http.StatusInternalServerError)
		return
	}

	// กำหนดเวลาปัจจุบันในเขตเวลา Asia/Bangkok
	currentTime := time.Now().In(location)

	// แทรกข้อมูลสินค้าใหม่ลงในฐานข้อมูล พร้อมเวลาปัจจุบัน
	query := "INSERT INTO orders (product_name, order_time) VALUES ($1, $2) RETURNING id, order_time"
	err = db.DB.QueryRow(query, order.ProductName, currentTime).Scan(&order.ID, &order.OrderTime)
	if err != nil {
		http.Error(w, "Failed to create order", http.StatusInternalServerError)
		return
	}

	// ส่งข้อมูลคำสั่งซื้อใหม่กลับไป
	w.WriteHeader(http.StatusCreated)
	json.NewEncoder(w).Encode(order)
}
