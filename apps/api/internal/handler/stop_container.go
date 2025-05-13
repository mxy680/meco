package handler

import (
	"encoding/json"
	"net/http"
	"log"
	"context"
	"time"
	"github.com/docker/docker/client"
)

// StopContainer stops a running container by its ID. Expects 'id' as a URL query param, returns {"ok": true/false}.
func StopContainer(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		http.Error(w, "Method Not Allowed", http.StatusMethodNotAllowed)
		return
	}
	containerID := r.URL.Query().Get("id")
	if containerID == "" {
		http.Error(w, "Missing container id", http.StatusBadRequest)
		return
	}
	cli, err := client.NewClientWithOpts(client.FromEnv)
	if err != nil {
		log.Printf("[ERROR] Docker client error: %v", err)
		json.NewEncoder(w).Encode(map[string]bool{"ok": false})
		return
	}
	ctx := context.Background()
	timeout := 10 * time.Second
	err = cli.ContainerStop(ctx, containerID, &timeout)
	if err != nil {
		log.Printf("[ERROR] Failed to stop container %s: %v", containerID, err)
		json.NewEncoder(w).Encode(map[string]bool{"ok": false})
		return
	}
	log.Printf("[INFO] Container %s stopped successfully", containerID)
	json.NewEncoder(w).Encode(map[string]bool{"ok": true})
}
