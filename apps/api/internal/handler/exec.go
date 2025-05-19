package handler

import (
	"encoding/json"
	"log"
	"net/http"
	"strings"

	"github.com/google/uuid"
	"github.com/gorilla/websocket"
	"github.com/mxy680/meco/apps/api/internal/model"
	"github.com/mxy680/meco/apps/api/internal/utils"
)

// ExecuteCode connects to the kernel websocket and sends an execute_request message.
func ExecuteCode(w http.ResponseWriter, r *http.Request) {
	kernelID := r.URL.Query().Get("kernel_id")
	if kernelID == "" {
		http.Error(w, "Missing kernel id", http.StatusBadRequest)
		return
	}
	var req struct {
		Code string `json:"code"`
	}
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil || strings.TrimSpace(req.Code) == "" {
		http.Error(w, "Missing or invalid code", http.StatusBadRequest)
		return
	}

	wsURL := "ws://127.0.0.1:8888/api/kernels/" + kernelID + "/channels"
	c, _, err := websocket.DefaultDialer.Dial(wsURL, nil)
	if err != nil {
		log.Printf("[ERROR] Failed to connect to kernel websocket: %v", err)
		http.Error(w, "Failed to connect to kernel websocket", http.StatusInternalServerError)
		return
	}
	defer c.Close()

	// Build execute_request message (simplified, not handling full Jupyter protocol)
	execMsg := model.ExecuteRequestMessage{
		Header: model.MessageHeader{
			MsgID:    uuid.NewString(),
			Username: "user",
			Session:  uuid.NewString(),
			MsgType:  "execute_request",
			Version:  "5.3",
		},
		ParentHeader: map[string]interface{}{},
		Metadata:     map[string]interface{}{},
		Content: model.ExecuteRequestContent{
			Code:            req.Code,
			Silent:          false,
			StoreHistory:    true,
			UserExpressions: map[string]string{},
			AllowStdin:      false,
			StopOnError:     true,
		},
	}
	if err := c.WriteJSON(execMsg); err != nil {
		log.Printf("[ERROR] Failed to send execute_request: %v", err)
		http.Error(w, "Failed to send execute_request", http.StatusInternalServerError)
		return
	}

	// Read response (simplified: read just one message)
	var resp map[string]interface{}
	if err := c.ReadJSON(&resp); err != nil {
		log.Printf("[ERROR] Failed to read kernel response: %v", err)
		http.Error(w, "Failed to read kernel response", http.StatusInternalServerError)
		return
	}
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(resp)
}

// ExecContainer executes a command in a running container.
func ExecContainer(w http.ResponseWriter, r *http.Request) {
	log.Printf("[INFO] ExecContainer called. Method: %s, URL: %s", r.Method, r.URL.String())
	if r.Method != http.MethodPost {
		http.Error(w, "Method Not Allowed", http.StatusMethodNotAllowed)
		return
	}
	containerID := r.URL.Query().Get("id")
	log.Printf("[DEBUG] Parsed containerID: %s", containerID)
	if containerID == "" {
		log.Printf("[WARN] Missing container id in request")
		http.Error(w, "Missing container id", http.StatusBadRequest)
		return
	}
	var req model.ExecContainerRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		log.Printf("[WARN] Invalid request body: %v", err)
		http.Error(w, "Invalid request body", http.StatusBadRequest)
		return
	}
	log.Printf("[DEBUG] Command to exec: %+v", req.Cmd)
	if len(req.Cmd) == 0 {
		log.Printf("[WARN] No command provided in request body")
		http.Error(w, "Missing command to execute", http.StatusBadRequest)
		return
	}
	output, err := utils.ExecInContainer(containerID, req.Cmd)
	if err != nil {
		log.Printf("[ERROR] ExecInContainer failed: %v", err)
		http.Error(w, "exec in container failed", http.StatusInternalServerError)
		return
	}
	w.Header().Set("Content-Type", "application/json")
	if err := json.NewEncoder(w).Encode(model.ExecContainerResponse{Output: output}); err != nil {
		log.Printf("[ERROR] Writing response failed: %v", err)
	}
}
