package handler

import (
	"context"
	"crypto/rand"
	"encoding/json"
	"fmt"
	"io"
	"log"
	"net/http"

	"github.com/docker/docker/api/types"
	"github.com/docker/docker/api/types/container"
	"github.com/docker/docker/client"
	"github.com/mxy680/meco/internal/model"
)

func CreateContainer(w http.ResponseWriter, r *http.Request) {
	log.Printf("[INFO] %s %s from %s", r.Method, r.URL.Path, r.RemoteAddr)
	if r.Method != http.MethodGet {
		log.Printf("[WARN] Method not allowed: %s", r.Method)
		http.Error(w, "Method Not Allowed", http.StatusMethodNotAllowed)
		return
	}
	log.Printf("[INFO] Creating Docker client...")
	cli, err := client.NewClientWithOpts(client.FromEnv)
	if err != nil {
		log.Printf("[ERROR] Docker client error: %v", err)
		http.Error(w, "docker client error", http.StatusInternalServerError)
		return
	}
	ctx := context.Background()
	image := "mxy680/meco-base:latest"
	log.Printf("[INFO] Pulling image '%s' if not present...", image)
	reader, err := cli.ImagePull(ctx, image, types.ImagePullOptions{})
	if err != nil {
		log.Printf("[ERROR] Failed to pull image: %v", err)
		http.Error(w, "failed to pull image", http.StatusInternalServerError)
		return
	}
	defer reader.Close()
	io.Copy(io.Discard, reader)

	log.Printf("[INFO] Creating container with image '%s' and default command...", image)
	// Generate a random hash for container name
	hashBytes := make([]byte, 8)
	_, err = io.ReadFull(rand.Reader, hashBytes)
	if err != nil {
		log.Printf("[ERROR] Failed to generate random hash: %v", err)
		http.Error(w, "failed to generate container name", http.StatusInternalServerError)
		return
	}
	containerName := "test-container-" + fmt.Sprintf("%x", hashBytes)

	resp, err := cli.ContainerCreate(ctx, &container.Config{
		Image: image,
	}, nil, nil, nil, containerName)
	if err != nil {
		log.Printf("[ERROR] Container creation failed: %v", err)
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	log.Printf("[INFO] Container created successfully, ID: %s", resp.ID)

	// Start the container after creation
	if err := cli.ContainerStart(ctx, resp.ID, types.ContainerStartOptions{}); err != nil {
		log.Printf("[ERROR] Failed to start container: %v", err)
		http.Error(w, "failed to start container", http.StatusInternalServerError)
		return
	}
	log.Printf("[INFO] Container started successfully, ID: %s", resp.ID)

	if err := json.NewEncoder(w).Encode(model.CreateContainerResponse{ID: resp.ID}); err != nil {
		log.Printf("[ERROR] Failed to encode response: %v", err)
	}
}
