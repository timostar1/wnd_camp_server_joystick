import websocket

ws = websocket.WebSocket()
ws.connect('ws://localhost:5000/echo')
r = ws.send('Hello!')
print(r)
print(ws.recv())
ws.close()
