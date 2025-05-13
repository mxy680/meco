package main

import (
	"log"
	"net/http"
	"github.com/mxy680/meco/internal/handler"
)

func main() {
	http.HandleFunc("/api/container/start", handler.CreateContainer)
	http.HandleFunc("/api/container/stop", handler.StopContainer)
	log.Println("API running on :8080")
	log.Fatal(http.ListenAndServe(":8080", nil))
}
