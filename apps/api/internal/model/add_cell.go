package model

type AddCellRequest struct {
	ContainerID string `json:"container_id"`
	CellType    string `json:"cell_type"` // "code" or "markdown"
	Source      string `json:"source"`
}

type AddCellResponse struct {
	Ok      bool   `json:"ok"`
	Path    string `json:"path"`
}
