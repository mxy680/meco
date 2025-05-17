package handler

import (
	"encoding/json"
	"log"
	"net/http"

	"github.com/mxy680/meco/internal/model"
	"github.com/mxy680/meco/internal/utils"
)

// InstallPackage installs a Python package in a running container.
func InstallPackage(w http.ResponseWriter, r *http.Request) {
	log.Printf("[INFO] InstallPackage called. Method: %s, URL: %s", r.Method, r.URL.String())
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
	var req model.InstallPackageRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		log.Printf("[WARN] Invalid request body: %v", err)
		http.Error(w, "Invalid request body", http.StatusBadRequest)
		return
	}
	if req.Package == "" {
		log.Printf("[WARN] No package provided in request body")
		http.Error(w, "Missing package to install", http.StatusBadRequest)
		return
	}
	pipArg := req.Package
	if req.Version != "" {
		pipArg += "==" + req.Version
	}
	log.Printf("[INFO] Installing package: %s", pipArg)
	output, err := utils.ExecInContainer(containerID, []string{"sh", "-c", "pip install " + pipArg})
	if err != nil {
		log.Printf("[ERROR] pip install failed: %v, output: %s", err, output)
		http.Error(w, "pip install failed: "+output, http.StatusInternalServerError)
		return
	}
	w.Header().Set("Content-Type", "application/json")
	if err := json.NewEncoder(w).Encode(map[string]string{"output": output}); err != nil {
		log.Printf("[ERROR] Writing response failed: %v", err)
	}
}
