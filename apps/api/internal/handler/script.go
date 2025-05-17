package handler

import (
	"encoding/json"
	"log"
	"net/http"
	"path/filepath"
	"strings"

	"github.com/mxy680/meco/internal/model"
	"github.com/mxy680/meco/internal/utils"
)

// CreateScript creates a new script file with the given name and optional content.
func CreateScript(w http.ResponseWriter, r *http.Request) {
	log.Printf("[INFO] CreateScript called. Method: %s, URL: %s", r.Method, r.URL.String())
	if r.Method != http.MethodPost {
		http.Error(w, "Method Not Allowed", http.StatusMethodNotAllowed)
		return
	}
	var req model.CreateScriptRequest
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
	// Ensure the scripts dir exists in the container
	_, err := utils.ExecInContainer(req.ContainerID, []string{"sh", "-c", "mkdir -p scripts"})
	if err != nil {
		log.Printf("[ERROR] Failed to create scripts dir in container: %v", err)
		http.Error(w, "Failed to create scripts dir in container", http.StatusInternalServerError)
		return
	}
	// Write the script file in the container
	if req.Content == "" {
		// Just create an empty file
		_, err = utils.ExecInContainer(req.ContainerID, []string{"sh", "-c", "touch '" + containerPath + "'"})
	} else {
		// Write content using a here-document for safe multiline support
		script := "cat <<'EOF' > '" + containerPath + "'\n" + strings.Replace(req.Content, "'", "'\\''", -1) + "\nEOF"
		_, err = utils.ExecInContainer(req.ContainerID, []string{"sh", "-c", script})
	}
	if err != nil {
		log.Printf("[ERROR] Failed to write script in container: %v", err)
		http.Error(w, "Failed to write script in container", http.StatusInternalServerError)
		return
	}
	resp := model.CreateScriptResponse{Ok: true, Path: containerPath}
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(resp)
}

// EditScript edits the content of an existing script file in the container.
func EditScript(w http.ResponseWriter, r *http.Request) {
	log.Printf("[INFO] EditScript called. Method: %s, URL: %s", r.Method, r.URL.String())
	if r.Method != http.MethodPost {
		http.Error(w, "Method Not Allowed", http.StatusMethodNotAllowed)
		return
	}
	var req model.EditScriptRequest
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
	if req.Content == "" {
		http.Error(w, "Missing new content", http.StatusBadRequest)
		return
	}
	// Sanitize name and ensure .py extension
	name := req.Name
	if filepath.Ext(name) != ".py" {
		name += ".py"
	}
	containerPath := filepath.Join("scripts", name)
	// Write new content using a here-document for safe multiline support
	script := "cat <<'EOF' > '" + containerPath + "'\n" + strings.Replace(req.Content, "'", "'\\''", -1) + "\nEOF"
	_, err := utils.ExecInContainer(req.ContainerID, []string{"sh", "-c", script})
	if err != nil {
		log.Printf("[ERROR] Failed to edit script in container: %v", err)
		http.Error(w, "Failed to edit script in container", http.StatusInternalServerError)
		return
	}
	resp := model.EditScriptResponse{Ok: true, Path: containerPath}
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(resp)
}

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
