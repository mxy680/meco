package model

type ExecContainerRequest struct {
	Cmd []string `json:"cmd"`
}

type ExecContainerResponse struct {
	Output string `json:"output"`
}
