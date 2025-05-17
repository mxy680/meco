package handler

import (
	"encoding/json"
	"log"
	"net/http"

	"github.com/mxy680/meco/internal/model"
	"github.com/mxy680/meco/internal/utils"
)

// ExecContainer executes a command in a running container.
func ExecContainer(w http.ResponseWriter, r *http.Request) {
	log.Printf("[INFO] ExecContainer called. Method: %s, URL: %s", r.Method, r.URL.String())
	if r.Method != http.MethodPost {
		http.Error(w, "Method Not Allowed", http.StatusMethodNotAllowed)
		return
	}
	containerID := r.URL.Query().Get("id")
	log.Printf("[DEBUG] Parsed containerID: %s", containerID)
	if containerID == "" {
		log.Printf("[WARN] Missing container id in request")
		http.Error(w, "Missing container id", http.StatusBadRequest)
		return
	}
	var req model.ExecContainerRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		log.Printf("[WARN] Invalid request body: %v", err)
		http.Error(w, "Invalid request body", http.StatusBadRequest)
		return
	}
	log.Printf("[DEBUG] Command to exec: %+v", req.Cmd)
	if len(req.Cmd) == 0 {
		log.Printf("[WARN] No command provided in request body")
		http.Error(w, "Missing command to execute", http.StatusBadRequest)
		return
	}
	output, err := utils.ExecInContainer(containerID, req.Cmd)
	if err != nil {
		log.Printf("[ERROR] ExecInContainer failed: %v", err)
		http.Error(w, "exec in container failed", http.StatusInternalServerError)
		return
	}
	w.Header().Set("Content-Type", "application/json")
	if err := json.NewEncoder(w).Encode(model.ExecContainerResponse{Output: output}); err != nil {
		log.Printf("[ERROR] Writing response failed: %v", err)
	}
}
