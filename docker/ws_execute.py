import sys
import uuid
import json
import websocket

def main(kernel_id, code):
    ws_url = f"ws://127.0.0.1:8888/api/kernels/{kernel_id}/channels"
    ws = websocket.create_connection(ws_url)

    # Build minimal Jupyter execute_request message
    msg_id = str(uuid.uuid4())
    exec_msg = {
        "header": {
            "msg_id": msg_id,
            "username": "user",
            "session": str(uuid.uuid4()),
            "msg_type": "execute_request",
            "version": "5.3",
        },
        "parent_header": {},
        "metadata": {},
        "content": {
            "code": code,
            "silent": False,
            "store_history": True,
            "user_expressions": {},
            "allow_stdin": False,
            "stop_on_error": True,
        },
        "channel": "shell"
    }

    ws.send(json.dumps(exec_msg))

    # Loop to collect output until execution is finished
    while True:
        resp = ws.recv()
        msg = json.loads(resp)
        msg_type = msg.get('msg_type') or msg.get('header', {}).get('msg_type')
        parent_msg_id = msg.get('parent_header', {}).get('msg_id', None)
        # Only process messages that are replies to our request, or have no parent (for status)
        if parent_msg_id not in (None, msg_id):
            continue
        if msg_type == 'stream':
            # stdout output (e.g., print)
            stream_content = msg.get('content', {}).get('text')
            if stream_content:
                print(stream_content.strip())
        elif msg_type == 'execute_result':
            # result of the code cell (e.g., value returned)
            data = msg.get('content', {}).get('data', {})
            if 'text/plain' in data:
                print(data['text/plain'].strip())
        elif msg_type == 'error':
            # error output
            traceback = msg.get('content', {}).get('traceback', [])
            print('\n'.join(traceback))
        elif msg_type == 'status':
            # kernel status
            if msg.get('content', {}).get('execution_state') == 'idle':
                break
    ws.close()

if __name__ == "__main__":
    if len(sys.argv) < 3:
        print("Usage: python ws_execute.py <kernel_id> <code>")
        sys.exit(1)
    kernel_id = sys.argv[1]
    code = sys.argv[2]
    main(kernel_id, code)
