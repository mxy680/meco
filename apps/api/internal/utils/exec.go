package utils

import (
	"bytes"
	"context"
	"log"
	"os/exec"

	"github.com/docker/docker/api/types/container"
	"github.com/docker/docker/client"
	"github.com/docker/docker/pkg/stdcopy"
)

// ExecHostCommand runs a command on the host and returns its combined output.
func ExecHostCommand(cmd []string) ([]byte, error) {
	if len(cmd) == 0 {
		return nil, nil
	}
	return exec.Command(cmd[0], cmd[1:]...).CombinedOutput()
}

// ExecInContainer executes a command in a running Docker container and returns the output or an error.
func ExecInContainer(containerID string, cmd []string) (string, error) {
	log.Printf("[INFO] ExecInContainer called. containerID: %s, cmd: %+v", containerID, cmd)
	cli, err := client.NewClientWithOpts(client.FromEnv, client.WithVersion("1.48"))
	if err != nil {
		log.Printf("[ERROR] Docker client error: %v", err)
		return "", err
	}
	ctx := context.Background()
	execConfig := container.ExecOptions{
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
	attachResp, err := cli.ContainerExecAttach(ctx, execResp.ID, container.ExecStartOptions{})
	if err != nil {
		log.Printf("[ERROR] Exec attach failed: %v", err)
		return "", err
	}
	log.Printf("[INFO] Attached to exec instance. Reading output...")
	defer attachResp.Close()

	// Demultiplex the Docker stream to remove header bytes
	var stdoutBuf, stderrBuf bytes.Buffer
	_, err = stdcopy.StdCopy(&stdoutBuf, &stderrBuf, attachResp.Reader)
	if err != nil {
		log.Printf("[ERROR] Demultiplexing exec output failed: %v", err)
		return "", err
	}

	log.Printf("[INFO] Exec output: %s", stdoutBuf.String())
	return stdoutBuf.String(), nil
}
