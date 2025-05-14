package utils

import (
	"context"
	"io"
	"log"

	"github.com/docker/docker/api/types"
	"github.com/docker/docker/client"
)

// ExecInContainer executes a command in a running Docker container and returns the output or an error.
func ExecInContainer(containerID string, cmd []string) (string, error) {
	log.Printf("[INFO] ExecInContainer called. containerID: %s, cmd: %+v", containerID, cmd)
	cli, err := client.NewClientWithOpts(client.FromEnv)
	if err != nil {
		log.Printf("[ERROR] Docker client error: %v", err)
		return "", err
	}
	ctx := context.Background()
	execConfig := types.ExecConfig{
		Cmd:          cmd,
		AttachStdout: true,
		AttachStderr: true,
	}
	log.Printf("[DEBUG] ExecConfig: %+v", execConfig)
	execResp, err := cli.ContainerExecCreate(ctx, containerID, execConfig)
	if err != nil {
		log.Printf("[ERROR] Exec create failed: %v", err)
		return "", err
	}
	log.Printf("[INFO] Exec instance created. ExecID: %s", execResp.ID)
	attachResp, err := cli.ContainerExecAttach(ctx, execResp.ID, types.ExecStartCheck{})
	if err != nil {
		log.Printf("[ERROR] Exec attach failed: %v", err)
		return "", err
	}
	log.Printf("[INFO] Attached to exec instance. Reading output...")
	defer attachResp.Close()
	output, err := io.ReadAll(attachResp.Reader)
	if err != nil {
		log.Printf("[ERROR] Reading exec output failed: %v", err)
		return "", err
	}
	log.Printf("[INFO] Exec output: %s", string(output))
	return string(output), nil
}
