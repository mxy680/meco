package model

type EditScriptRequest struct {
	ContainerID string `json:"container_id"`
	Name        string `json:"name"`
	Content     string `json:"content"`
}

type EditScriptResponse struct {
	Ok   bool   `json:"ok"`
	Path string `json:"path"`
}
