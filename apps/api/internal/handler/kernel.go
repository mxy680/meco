package handler

import (
	"encoding/json"
	"log"
	"net/http"
	"os/exec"
	"time"

	"github.com/mxy680/meco/internal/model"
)


// InterruptKernel interrupts a specific kernel in the container.
func InterruptKernel(w http.ResponseWriter, r *http.Request) {
	containerID := r.URL.Query().Get("id")
	kernelID := r.URL.Query().Get("kernel_id")
	if containerID == "" || kernelID == "" {
		http.Error(w, "Missing container id or kernel id", http.StatusBadRequest)
		return
	}
	cmd := exec.Command("docker", "exec", containerID, "curl", "-s", "-X", "POST", "http://127.0.0.1:8888/api/kernels/"+kernelID+"/interrupt")
	output, err := cmd.Output()
	if err != nil {
		log.Printf("[ERROR] Failed to interrupt kernel: %v", err)
		http.Error(w, "Failed to interrupt kernel", http.StatusBadGateway)
		return
	}
	w.WriteHeader(http.StatusNoContent)
	w.Write(output)
}

// RestartKernel restarts a specific kernel in the container.
func RestartKernel(w http.ResponseWriter, r *http.Request) {
	containerID := r.URL.Query().Get("id")
	kernelID := r.URL.Query().Get("kernel_id")
	if containerID == "" || kernelID == "" {
		http.Error(w, "Missing container id or kernel id", http.StatusBadRequest)
		return
	}
	cmd := exec.Command("docker", "exec", containerID, "curl", "-s", "-X", "POST", "http://127.0.0.1:8888/api/kernels/"+kernelID+"/restart")
	output, err := cmd.Output()
	if err != nil {
		log.Printf("[ERROR] Failed to restart kernel: %v", err)
		http.Error(w, "Failed to restart kernel", http.StatusBadGateway)
		return
	}
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	w.Write(output)
}

// DeleteKernel deletes a specific kernel in the container.
func DeleteKernel(w http.ResponseWriter, r *http.Request) {
	containerID := r.URL.Query().Get("id")
	kernelID := r.URL.Query().Get("kernel_id")
	if containerID == "" || kernelID == "" {
		http.Error(w, "Missing container id or kernel id", http.StatusBadRequest)
		return
	}
	cmd := exec.Command("docker", "exec", containerID, "curl", "-s", "-X", "DELETE", "http://127.0.0.1:8888/api/kernels/"+kernelID)
	output, err := cmd.Output()
	if err != nil {
		log.Printf("[ERROR] Failed to delete kernel: %v", err)
		http.Error(w, "Failed to delete kernel", http.StatusBadGateway)
		return
	}
	w.WriteHeader(http.StatusNoContent)
	w.Write(output)
}

// GetKernelInfo returns information about a specific kernel in the container.
func GetKernelInfo(w http.ResponseWriter, r *http.Request) {
	containerID := r.URL.Query().Get("id")
	kernelID := r.URL.Query().Get("kernel_id")
	if containerID == "" || kernelID == "" {
		http.Error(w, "Missing container id or kernel id", http.StatusBadRequest)
		return
	}
	cmd := exec.Command("docker", "exec", containerID, "curl", "-s", "http://127.0.0.1:8888/api/kernels/"+kernelID)
	output, err := cmd.Output()
	if err != nil {
		log.Printf("[ERROR] Failed to get kernel info: %v", err)
		http.Error(w, "Failed to get kernel info", http.StatusBadGateway)
		return
	}
	var info model.KernelInfoResponse
	if err := json.Unmarshal(output, &info); err != nil {
		log.Printf("[ERROR] Failed to unmarshal kernel info: %v", err)
		http.Error(w, "Failed to parse kernel info", http.StatusInternalServerError)
		return
	}
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(info)
}

// CreateKernel handles kernel creation requests for a running Jupyter Kernel Gateway container.
// It expects a query param: id=<container_id>
func CreateKernel(w http.ResponseWriter, r *http.Request) {
	containerID := r.URL.Query().Get("id")
	if containerID == "" {
		http.Error(w, "Missing container id", http.StatusBadRequest)
		return
	}

	// Retry logic for /api/kernelspecs inside the container
	var ksOutput []byte
	var ksErr error
	maxRetries := 10
	for i := 0; i < maxRetries; i++ {
		ksCmd := exec.Command("docker", "exec", containerID, "curl", "-s", "http://127.0.0.1:8888/api/kernelspecs")
		ksOutput, ksErr = ksCmd.Output()
		if ksErr == nil {
			log.Printf("[DEBUG] Kernel specs (attempt %d): %s", i+1, ksOutput)
			break
		}
		log.Printf("[WARN] Attempt %d: Failed to get kernelspecs inside container: %v", i+1, ksErr)
		time.Sleep(1 * time.Second)
	}
	if ksErr != nil {
		log.Printf("[ERROR] All attempts failed to get kernelspecs inside container: %v", ksErr)
		http.Error(w, "Failed to get kernelspecs from container", http.StatusBadGateway)
		return
	}

	// Create a kernel via the Jupyter Kernel Gateway REST API from inside the container
	createCmd := exec.Command("docker", "exec", containerID, "curl", "-s", "-X", "POST", "http://127.0.0.1:8888/api/kernels")
	createOutput, createErr := createCmd.Output()
	if createErr != nil {
		log.Printf("[ERROR] Failed to create kernel inside container: %v", createErr)
		http.Error(w, "Failed to create kernel", http.StatusBadGateway)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	w.Write(createOutput)
}
