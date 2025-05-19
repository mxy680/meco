import sys
import time
import websocket

if len(sys.argv) != 2:
    print("Usage: python ws_connect.py <kernel_id>")
    sys.exit(1)

kernel_id = sys.argv[1]
ws_url = f"ws://127.0.0.1:8888/api/kernels/{kernel_id}/channels"

try:
    ws = websocket.create_connection(ws_url)
    print(f"Connected to {ws_url}")
    # Wait a bit to show connection is alive, then close
    time.sleep(2)
    ws.close()
    print("Connection closed.")
except Exception as e:
    print(f"Failed to connect: {e}")
