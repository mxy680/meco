package handler

import (
	"encoding/json"
	"bytes"
	"log"
	"net/http"
	"os"

	"github.com/mxy680/meco/internal/model"
	"github.com/mxy680/meco/internal/utils"
)

// AddCell adds a cell to the main.ipynb notebook in the container.
func AddCell(w http.ResponseWriter, r *http.Request) {
	log.Printf("[INFO] AddCell called. Method: %s, URL: %s", r.Method, r.URL.String())
	if r.Method != http.MethodPost {
		http.Error(w, "Method Not Allowed", http.StatusMethodNotAllowed)
		return
	}
	var req model.AddCellRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		log.Printf("[WARN] Invalid request body: %v", err)
		http.Error(w, "Invalid request body", http.StatusBadRequest)
		return
	}
	if req.ContainerID == "" {
		http.Error(w, "Missing container_id", http.StatusBadRequest)
		return
	}
	if req.CellType != "code" && req.CellType != "markdown" {
		http.Error(w, "Invalid cell_type: must be 'code' or 'markdown'", http.StatusBadRequest)
		return
	}
	if req.Source == "" {
		http.Error(w, "Missing source", http.StatusBadRequest)
		return
	}

	// Copy main.ipynb from container to host (in-memory)
	containerPath := "/app/main.ipynb"
	tmpFile, err := os.CreateTemp("", "main-*.ipynb")
	if err != nil {
		log.Printf("[ERROR] Failed to create temp file: %v", err)
		http.Error(w, "Failed to create temp file", http.StatusInternalServerError)
		return
	}
	defer os.Remove(tmpFile.Name())

	if err := utils.CopyFileFromContainer(req.ContainerID, containerPath, tmpFile.Name()); err != nil {
		log.Printf("[ERROR] Failed to copy notebook from container: %v", err)
		http.Error(w, "Failed to copy notebook from container", http.StatusInternalServerError)
		return
	}

	// Read and unmarshal notebook
	notebookBytes, err := os.ReadFile(tmpFile.Name())
	if err != nil {
		log.Printf("[ERROR] Failed to read notebook: %v", err)
		http.Error(w, "Failed to read notebook", http.StatusInternalServerError)
		return
	}
	// Sanitize notebookBytes: remove leading bytes before first '{'
	if idx := bytes.IndexByte(notebookBytes, '{'); idx > 0 {
		notebookBytes = notebookBytes[idx:]
	}
	var nb map[string]interface{}
	if err := json.Unmarshal(notebookBytes, &nb); err != nil {
		log.Printf("[ERROR] Failed to parse notebook: %v", err)
		http.Error(w, "Failed to parse notebook", http.StatusInternalServerError)
		return
	}
	cells, ok := nb["cells"].([]interface{})
	if !ok {
		log.Printf("[ERROR] Notebook missing 'cells' array")
		http.Error(w, "Notebook missing 'cells' array", http.StatusInternalServerError)
		return
	}

	// Add new cell
	newCell := map[string]interface{}{
		"cell_type": req.CellType,
		"metadata":  map[string]interface{}{},
		"source":    []string{req.Source},
	}
	if req.CellType == "code" {
		newCell["outputs"] = []interface{}{}
		newCell["execution_count"] = nil
	}
	cells = append(cells, newCell)
	nb["cells"] = cells

	// Marshal and write back
	newBytes, err := json.MarshalIndent(nb, "", "  ")
	if err != nil {
		log.Printf("[ERROR] Failed to marshal notebook: %v", err)
		http.Error(w, "Failed to marshal notebook", http.StatusInternalServerError)
		return
	}
	if err := os.WriteFile(tmpFile.Name(), newBytes, 0644); err != nil {
		log.Printf("[ERROR] Failed to write notebook: %v", err)
		http.Error(w, "Failed to write notebook", http.StatusInternalServerError)
		return
	}

	// Copy back to container
	if err := utils.CopyFileToContainer(req.ContainerID, tmpFile.Name(), containerPath); err != nil {
		log.Printf("[ERROR] Failed to copy notebook to container: %v", err)
		http.Error(w, "Failed to copy notebook to container", http.StatusInternalServerError)
		return
	}
	resp := model.AddCellResponse{Ok: true, Path: containerPath}
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(resp)
}
