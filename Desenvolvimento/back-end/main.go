package main

import (
	"log"
	"projects/desenvolvimento/back-end/api"

	"github.com/joho/godotenv"
)

// init is invoked before main()
func init() {
	// loads values from .env into the system
	if err := godotenv.Load(); err != nil {
		log.Print("No .env file found")
	}
}

func main() {
	log.SetFlags(log.LstdFlags | log.Lshortfile) //Informa o local do erro
	api := api.App{}
	api.StartServer()
}
