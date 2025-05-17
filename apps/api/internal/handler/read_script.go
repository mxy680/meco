package handler

import (
	"encoding/json"
	"log"
	"net/http"
	"path/filepath"

	"github.com/mxy680/meco/internal/model"
	"github.com/mxy680/meco/internal/utils"
)

// ReadScript reads the content of a script file in the container.
func ReadScript(w http.ResponseWriter, r *http.Request) {
	log.Printf("[INFO] ReadScript called. Method: %s, URL: %s", r.Method, r.URL.String())
	if r.Method != http.MethodPost {
		http.Error(w, "Method Not Allowed", http.StatusMethodNotAllowed)
		return
	}
	var req model.ReadScriptRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		log.Printf("[WARN] Invalid request body: %v", err)
		http.Error(w, "Invalid request body", http.StatusBadRequest)
		return
	}
	if req.ContainerID == "" {
		http.Error(w, "Missing container_id", http.StatusBadRequest)
		return
	}
	if req.Name == "" {
		http.Error(w, "Missing script name", http.StatusBadRequest)
		return
	}
	// Sanitize name and ensure .py extension
	name := req.Name
	if filepath.Ext(name) != ".py" {
		name += ".py"
	}
	containerPath := filepath.Join("scripts", name)
	// Read the file content from the container
	cmd := []string{"sh", "-c", "cat '" + containerPath + "'"}
	output, err := utils.ExecInContainer(req.ContainerID, cmd)
	if err != nil {
		log.Printf("[ERROR] Failed to read script in container: %v", err)
		http.Error(w, "Failed to read script in container", http.StatusInternalServerError)
		return
	}
	resp := model.ReadScriptResponse{Ok: true, Path: containerPath, Content: output}
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(resp)
}
