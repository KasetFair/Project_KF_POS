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
	rows, err := db.DB.Query("SELECT id, product_name, order_time, amount FROM orders ORDER BY order_time DESC")
	if err != nil {
		http.Error(w, "Failed to fetch orders", http.StatusInternalServerError)
		return
	}
	defer rows.Close()

	// สร้างรายการสินค้า
	var orders []models.Order
	for rows.Next() {
		var order models.Order
		if err := rows.Scan(&order.ID, &order.ProductName, &order.OrderTime, &order.Amount); err != nil {
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
	var order models.CreateOrderRequest
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
	query := "INSERT INTO orders (product_name, order_time,amount) VALUES ($1, $2, $3) RETURNING id"
	insertedOrders := []map[string]interface{}{}
	var totalAmount int

	for productName,amount := range order.Products{
		var id int
		err = db.DB.QueryRow(query, productName, currentTime,amount).Scan(&id)
		if err != nil {
			http.Error(w, "Failed to create order", http.StatusInternalServerError)
			return
		}
		insertedOrders = append(insertedOrders, map[string]interface{}{
			"product_name": productName,
			"amount":       amount,
		})
		totalAmount += amount
	}

	// สร้าง Response JSON
	response := map[string]interface{}{
		"status": "success",
		"data": map[string]interface{}{
			"orders":      insertedOrders,
			"total_price": totalAmount * 50, // สมมติราคาต่อหน่วยคือ 50 บาท
		},
	}

	// ส่งข้อมูลคำสั่งซื้อใหม่กลับไป
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusCreated)
	json.NewEncoder(w).Encode(response)
}
