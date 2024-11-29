package main

import (
	"backend/db"
	"backend/handlers"
	"log"
	"net/http"

	"github.com/gorilla/mux"
)

func main() {
	// เชื่อมต่อฐานข้อมูล
	db.InitDB()

	// สร้าง Router
	r := mux.NewRouter()

	// กำหนด Endpoint แยกกันสำหรับ GET และ POST
	r.HandleFunc("/orders", handlers.GetOrdersHandler).Methods("GET")
	r.HandleFunc("/orders", handlers.CreateOrderHandler).Methods("POST")

	// เริ่มเซิร์ฟเวอร์
	log.Println("Server running on port 8080")
	log.Fatal(http.ListenAndServe(":8080", r))
}
