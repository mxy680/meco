package main

import (
	"log"
	"net/http"

	"github.com/mxy680/meco/internal/handler"
)

func main() {
	http.HandleFunc("/api/container/kernel", handler.CreateKernel)
	http.HandleFunc("/api/container/start", handler.CreateContainer)
	http.HandleFunc("/api/container/stop", handler.StopContainer)
	http.HandleFunc("/api/container/exec", handler.ExecContainer)
	http.HandleFunc("/api/container/install", handler.InstallPackage)
	http.HandleFunc("/api/container/script/create", handler.CreateScript)
	http.HandleFunc("/api/container/script/edit", handler.EditScript)
	http.HandleFunc("/api/container/script/read", handler.ReadScript)

	log.Println("API running on :8080")
	log.Fatal(http.ListenAndServe(":8080", nil))
}
