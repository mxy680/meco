package model

type CreateContainerRequest struct {
	Cmd   []string `json:"cmd,omitempty"`
	Name  string   `json:"name,omitempty"`
}

type CreateContainerResponse struct {
	ID string `json:"id"`
}
