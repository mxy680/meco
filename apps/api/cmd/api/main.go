package main

import (
	"log"
	"net/http"

	"github.com/mxy680/meco/apps/api/internal/handler"
)

func main() {
	http.HandleFunc("/api/container/start", handler.CreateContainer)      // POST: ?id=<container_id>
	http.HandleFunc("/api/container/stop", handler.StopContainer)         // POST: ?id=<container_id>
	http.HandleFunc("/api/container/exec", handler.ExecContainer)         // POST: ?id=<container_id>&cmd=<command>
	http.HandleFunc("/api/container/install", handler.InstallPackage)     // POST: ?id=<container_id>&package=<package_name>
	http.HandleFunc("/api/container/script/create", handler.CreateScript) // POST: ?id=<container_id>&name=<script_name>&content=<script_content>
	http.HandleFunc("/api/container/script/edit", handler.EditScript)     // POST: ?id=<container_id>&name=<script_name>&content=<script_content>
	http.HandleFunc("/api/container/script/read", handler.ReadScript)     // GET: ?id=<container_id>&name=<script_name>

	http.HandleFunc("/api/kernels/start", handler.CreateKernel)        // POST: ?id=<container_id>
	http.HandleFunc("/api/kernels/interrupt", handler.InterruptKernel) // POST: ?id=<container_id>&kernel_id=<kernel_id>
	http.HandleFunc("/api/kernels/restart", handler.RestartKernel)     // POST: ?id=<container_id>&kernel_id=<kernel_id>
	http.HandleFunc("/api/kernels/delete", handler.DeleteKernel)       // DELETE: ?id=<container_id>&kernel_id=<kernel_id>
	http.HandleFunc("/api/kernels/execute", handler.ExecuteCode)       // POST: ?id=<container_id>&kernel_id=<kernel_id>, body: {code}

	log.Println("API running on :8080")
	log.Fatal(http.ListenAndServe(":8080", nil))
}
