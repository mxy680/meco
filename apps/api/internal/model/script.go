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

type EditScriptRequest struct {
	ContainerID string `json:"container_id"`
	Name        string `json:"name"`
	Content     string `json:"content"`
}

type EditScriptResponse struct {
	Ok   bool   `json:"ok"`
	Path string `json:"path"`
}

type ReadScriptRequest struct {
	ContainerID string `json:"container_id"`
	Name        string `json:"name"`
}

type ReadScriptResponse struct {
	Ok      bool   `json:"ok"`
	Path    string `json:"path"`
	Content string `json:"content"`
}
