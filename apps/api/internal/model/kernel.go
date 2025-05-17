package model

type Kernel struct {
	ID             string `json:"id"`
	Name           string `json:"name,omitempty"`
	LastActivity   string `json:"last_activity,omitempty"`
	ExecutionState string `json:"execution_state,omitempty"`
	Connections    int    `json:"connections,omitempty"`
}

type KernelListResponse []Kernel

type KernelInfoResponse struct {
	ID   string `json:"id"`
	Name string `json:"name,omitempty"`
}
