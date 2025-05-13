package handler

import (
	"encoding/json"
	"net/http"
	"context"
	"github.com/docker/docker/api/types/container"
	"github.com/docker/docker/client"
)


func CreateContainer(w http.ResponseWriter, r *http.Request) {
	var req model.CreateContainerRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		http.Error(w, "bad request", http.StatusBadRequest)
		return
	}
	cli, err := client.NewClientWithOpts(client.FromEnv)
	if err != nil {
		http.Error(w, "docker client error", http.StatusInternalServerError)
		return
	}
	ctx := context.Background()
	resp, err := cli.ContainerCreate(ctx, &container.Config{
		Image: "mxy680/clip-inference",
		Cmd:   req.Cmd,
	}, nil, nil, nil, req.Name)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	json.NewEncoder(w).Encode(model.CreateContainerResponse{ID: resp.ID})
}
