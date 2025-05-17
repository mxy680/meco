package handler

import (
	"fmt"
	"io"
	"log"
	"net/http"
	"os/exec"
)

// CreateKernel handles kernel creation requests for a running Jupyter Kernel Gateway container.
// It expects a query param: id=<container_id>
func CreateKernel(w http.ResponseWriter, r *http.Request) {
	containerID := r.URL.Query().Get("id")
	if containerID == "" {
		http.Error(w, "Missing container id", http.StatusBadRequest)
		return
	}

	// Find the mapped port for 8888
	cmd := exec.Command("docker", "inspect", "-f", "{{(index (index .NetworkSettings.Ports \"8888/tcp\") 0).HostPort}}", containerID)
	output, err := cmd.Output()
	if err != nil {
		log.Printf("[ERROR] Could not get JKG port: %v", err)
		http.Error(w, "Failed to get JKG port", http.StatusInternalServerError)
		return
	}
	port := string(output)
	port = string([]byte(port))
	port = string([]byte(port[:len(port)-1])) // Remove newline

	// Create a kernel via the Jupyter Kernel Gateway REST API
	url := fmt.Sprintf("http://127.0.0.1:%s/api/kernels", port)
	resp, err := http.Post(url, "application/json", nil)
	if err != nil {
		log.Printf("[ERROR] Failed to create kernel: %v", err)
		http.Error(w, "Failed to create kernel", http.StatusBadGateway)
		return
	}
	defer resp.Body.Close()

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(resp.StatusCode)
	io.Copy(w, resp.Body)
}
