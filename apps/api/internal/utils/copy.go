package utils

import (
	"archive/tar"
	"bytes"
	"context"
	"fmt"
	"io"
	"os"
	"path/filepath"

	"github.com/docker/docker/api/types/container"
	"github.com/docker/docker/client"
)

// CopyFileFromContainer copies a file from the container to the host.
func CopyFileFromContainer(containerID, containerPath, hostPath string) error {
	cli, err := client.NewClientWithOpts(client.FromEnv, client.WithVersion("1.48"))
	if err != nil {
		return err
	}
	defer cli.Close()

	ctx := context.Background()
	reader, _, err := cli.CopyFromContainer(ctx, containerID, containerPath)
	if err != nil {
		return err
	}
	defer reader.Close()

	tarReader := tar.NewReader(reader)
	found := false
	for {
		header, err := tarReader.Next()
		if err == io.EOF {
			break
		}
		if err != nil {
			return err
		}
		// Only extract the file matching the base name of containerPath
		if header.Typeflag == tar.TypeReg {
			if filepath.Base(header.Name) == filepath.Base(containerPath) {
				outFile, err := os.Create(hostPath)
				if err != nil {
					return err
				}
				defer outFile.Close()
				if _, err := io.Copy(outFile, tarReader); err != nil {
					return err
				}
				found = true
				break
			}
		}
	}
	if !found {
		return fmt.Errorf("file %s not found in tar archive", containerPath)
	}
	return nil
}

// CopyFileToContainer copies a file from the host to the container.
func CopyFileToContainer(containerID, hostPath, containerPath string) error {
	cli, err := client.NewClientWithOpts(client.FromEnv, client.WithVersion("1.48"))
	if err != nil {
		return err
	}
	defer cli.Close()

	ctx := context.Background()
	buf := new(bytes.Buffer)
	tw := tar.NewWriter(buf)
	defer tw.Close()

	file, err := os.Open(hostPath)
	if err != nil {
		return err
	}
	defer file.Close()

	stat, err := file.Stat()
	if err != nil {
		return err
	}

	hdr := &tar.Header{
		Name: filepath.Base(containerPath),
		Mode: 0644,
		Size: stat.Size(),
	}
	if err := tw.WriteHeader(hdr); err != nil {
		return err
	}
	if _, err := io.Copy(tw, file); err != nil {
		return err
	}
	tw.Close()

	return cli.CopyToContainer(ctx, containerID, filepath.Dir(containerPath), buf, container.CopyToContainerOptions{AllowOverwriteDirWithFile: true})
}
