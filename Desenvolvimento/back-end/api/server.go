package api

import (
	"database/sql"
	"fmt"
	"log"
	"net/http"
	"projects/back-end/api/handler"

	"github.com/gorilla/mux"
)

// App struct ...
type App struct {
	Router *mux.Router
	DB     *sql.DB
}

func corsMiddleware(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Access-Control-Allow-Origin", "*")
		w.Header().Set("Access-Control-Allow-Headers", "Origin, Content-Type, X-Auth-Token, Authorization")
		if r.Method == "OPTIONS" {
			w.Header().Set("Access-Control-Allow-Methods", "GET, POST, PATCH, PUT, DELETE, OPTIONS")
			w.Header().Set("Content-Type", "application/json")
			return
		}
		next.ServeHTTP(w, r)
	})
}

//StartServer ...
func (a *App) StartServer() {
	a.Router = mux.NewRouter()
	s := a.Router.PathPrefix("/api/v1").Subrouter()
	s.HandleFunc("/health", handler.HealthCheck).Methods(http.MethodGet)

	s.HandleFunc("/auth", handler.Login).Methods(http.MethodPost)

	s.HandleFunc("/person", handler.InsertPerson).Methods(http.MethodPost)
	s.HandleFunc("/person/{id:[0-9]+}", handler.GetPerson).Methods(http.MethodGet)

	// developer
	s.HandleFunc("/project", handler.GetProjects).Methods(http.MethodGet)
	s.HandleFunc("/project/{id:[0-9]+}/person/{id_pessoa:[0-9]+}", handler.GetProjects).Methods(http.MethodGet)

	// company
	s.HandleFunc("/project", handler.InsertProject).Methods(http.MethodPost)
	s.HandleFunc("/project/company/{id:[0-9]+}", handler.GetProjectsByCompany).Methods(http.MethodGet)

	a.Router.Handle("/api/v1/{_:.*}", a.Router)
	port := 10001
	log.Printf("Starting Server on port %d", port)
	log.Fatal(http.ListenAndServe(fmt.Sprintf(":%d", port), corsMiddleware(a.Router)))
}
