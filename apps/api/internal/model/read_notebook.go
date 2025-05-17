package model

type ReadNotebookRequest struct {
	ContainerID string `json:"container_id"`
}


type ReadNotebookResponse struct {
	Ok      bool   `json:"ok"`
	Path    string `json:"path"`
	Content string `json:"content"`
}
