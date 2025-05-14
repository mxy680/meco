package model

type CreateScriptRequest struct {
	ContainerID string `json:"container_id"`
	Name        string `json:"name"`
	Content     string `json:"content,omitempty"`
}

type CreateScriptResponse struct {
	Ok   bool   `json:"ok"`
	Path string `json:"path"`
}
