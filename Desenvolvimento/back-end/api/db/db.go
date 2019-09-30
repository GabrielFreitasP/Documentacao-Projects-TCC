package db

import (
	"database/sql"
	"log"
	"os"

	_ "github.com/lib/pq" // pure Go Postgres driver for the database/sql package
)

//DB do aplicativo ...
type DB struct {
	DB *sql.DB
}

//Connection ...
func (a *DB) Connection() error {
	psqlInfo := os.Getenv("DATABASE_URL")
	var err error

	a.DB, err = sql.Open("postgres", psqlInfo)
	if err != nil {
		log.Printf("[db/OpenConnection] - Erro ao tentar abrir conexão. Erro: %s", err.Error())
		return err
	}
	return nil
}
