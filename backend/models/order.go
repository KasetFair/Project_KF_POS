package models

type Order struct {
	ID          int    `json:"id"`
	ProductName string `json:"product_name"`
	OrderTime   string `json:"order_time"`
	Amount 		int    `json:"amount"`
}

type CreateOrderRequest struct{
	Products map[string]int `json:"products"`
}