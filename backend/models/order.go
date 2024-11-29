package models

type Order struct {
	ID          int    `json:"id"`
	ProductName string `json:"product_name"`
	OrderTime   string `json:"order_time"`
}
