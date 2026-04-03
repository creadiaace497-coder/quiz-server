const http = require("http");
const WebSocket = require("ws");

const port = process.env.PORT || 3000;

// HTTPサーバーを作る（Render対策）
const server = http.createServer((req, res) => {
    res.writeHead(200);
    res.end("Server is running");
});

// WebSocketを紐付け
const wss = new WebSocket.Server({ server });

let host = null;

wss.on("connection", (ws) => {
    console.log("接続");

    ws.on("message", (msg) => {
        const data = JSON.parse(msg);

        if (data.type === "hello") {
            if (data.role === "host") {
                host = ws;
                console.log("ホスト登録");
            }
        }

        if (data.type === "answer") {
            if (host && host.readyState === WebSocket.OPEN) {
                host.send(JSON.stringify(data));
            }
        }
    });

    ws.on("close", () => {
        if (ws === host) host = null;
    });
});

// ★ここ重要
server.listen(port, () => {
    console.log("Server running on port " + port);
});
