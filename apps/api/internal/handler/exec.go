package handler

import (
	"encoding/json"
	"log"
	"net/http"
	"strings"

	"github.com/mxy680/meco/apps/api/internal/model"
	"github.com/mxy680/meco/apps/api/internal/utils"
)

// ExecuteCode executes ws_execute.py in the specified Docker container with the given kernel and code.
func ExecuteCode(w http.ResponseWriter, r *http.Request) {
	containerID := r.URL.Query().Get("id") // Expect container ID as query param
	kernelID := r.URL.Query().Get("kernel_id")
	if containerID == "" || kernelID == "" {
		http.Error(w, "Missing container id or kernel id", http.StatusBadRequest)
		return
	}
	var req struct {
		Code string `json:"code"`
	}
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil || req.Code == "" {
		http.Error(w, "Missing or invalid code", http.StatusBadRequest)
		return
	}

	cmd := []string{"python", "/usr/local/bin/ws_execute.py", kernelID, req.Code}
	output, err := utils.ExecInContainer(containerID, cmd)
	if err != nil {
		log.Printf("[ERROR] ExecInContainer failed: %v", err)
		http.Error(w, "exec in container failed", http.StatusInternalServerError)
		return
	}
	trimmedOutput := strings.TrimSpace(output)
	w.Header().Set("Content-Type", "application/json")
	if err := json.NewEncoder(w).Encode(model.ExecContainerResponse{Output: trimmedOutput}); err != nil {
		log.Printf("[ERROR] Writing response failed: %v", err)
	}
}

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
