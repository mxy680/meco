package model

type InstallPackageRequest struct {
	Package string `json:"package"`
	Version string `json:"version,omitempty"`
}
