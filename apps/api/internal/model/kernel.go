package model

// MessageHeader represents the Jupyter protocol message header.
type MessageHeader struct {
	MsgID      string `json:"msg_id"`
	Username   string `json:"username"`
	Session    string `json:"session"`
	MsgType    string `json:"msg_type"`
	Version    string `json:"version"`
}

// ExecuteRequestContent is the content for an execute_request message.
type ExecuteRequestContent struct {
	Code            string            `json:"code"`
	Silent          bool              `json:"silent"`
	StoreHistory    bool              `json:"store_history"`
	UserExpressions map[string]string `json:"user_expressions"`
	AllowStdin      bool              `json:"allow_stdin"`
	StopOnError     bool              `json:"stop_on_error"`
}

// ExecuteRequestMessage is the full Jupyter message for execute_request.
type ExecuteRequestMessage struct {
	Header       MessageHeader         `json:"header"`
	ParentHeader map[string]interface{} `json:"parent_header"`
	Metadata     map[string]interface{} `json:"metadata"`
	Content      ExecuteRequestContent  `json:"content"`
}

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
