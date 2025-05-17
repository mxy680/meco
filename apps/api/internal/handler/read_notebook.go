package handler

import (
	"encoding/json"
	"log"
	"net/http"
	"path/filepath"

	"github.com/mxy680/meco/internal/model"
	"github.com/mxy680/meco/internal/utils"
)

// ReadNotebook reads the content of a notebook file in the container.
func ReadNotebook(w http.ResponseWriter, r *http.Request) {
	log.Printf("[INFO] ReadNotebook called. Method: %s, URL: %s", r.Method, r.URL.String())
	if r.Method != http.MethodPost {
		http.Error(w, "Method Not Allowed", http.StatusMethodNotAllowed)
		return
	}
	var req model.ReadNotebookRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		log.Printf("[WARN] Invalid request body: %v", err)
		http.Error(w, "Invalid request body", http.StatusBadRequest)
		return
	}
	if req.ContainerID == "" {
		http.Error(w, "Missing container_id", http.StatusBadRequest)
		return
	}
	containerPath := filepath.Join("/app", "main.ipynb")
	cmd := []string{"sh", "-c", "cat '" + containerPath + "'"}
	output, err := utils.ExecInContainer(req.ContainerID, cmd)
	if err != nil {
		log.Printf("[ERROR] Failed to read notebook in container: %v", err)
		http.Error(w, "Failed to read notebook in container", http.StatusInternalServerError)
		return
	}
	resp := model.ReadNotebookResponse{Ok: true, Path: containerPath, Content: output}
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(resp)
}
