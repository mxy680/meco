package model

type ReadScriptRequest struct {
	ContainerID string `json:"container_id"`
	Name        string `json:"name"`
}

type ReadScriptResponse struct {
	Ok      bool   `json:"ok"`
	Path    string `json:"path"`
	Content string `json:"content"`
}
