package model

type CreateContainerResponse struct {
	ID string `json:"id"`
}

type StopContainerResponse struct {
	OK bool `json:"ok"`
}
