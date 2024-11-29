package db

import (
	"database/sql"
	"log"

	_ "github.com/lib/pq" // Import PostgreSQL driver
)

var DB *sql.DB

func InitDB() {
	var err error
	// Connection String สำหรับ PostgreSQL
	connStr := "postgres://neondb_owner:s2gCjFOrwGq9@ep-little-rice-a1ra026y-pooler.ap-southeast-1.aws.neon.tech/neondb?sslmode=require"
	DB, err = sql.Open("postgres", connStr)
	if err != nil {
		log.Fatalf("Failed to connect to the database: %v", err)
	}

	// ทดสอบการเชื่อมต่อ
	err = DB.Ping()
	if err != nil {
		log.Fatalf("Database is not reachable: %v", err)
	}

	log.Println("Connected to the database successfully!")
}
