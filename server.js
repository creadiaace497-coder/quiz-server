const WebSocket = require("ws");

// ポート（Render対応）
const port = process.env.PORT || 3000;

const wss = new WebSocket.Server({ port });

let host = null;

wss.on("connection", (ws) => {
    console.log("接続された");

    ws.on("message", (msg) => {
        const data = JSON.parse(msg);

        // ホスト登録
        if (data.type === "hello") {
            if (data.role === "host") {
                host = ws;
                console.log("ホスト登録");
            }
        }

        // 回答をホストへ即転送
        if (data.type === "answer") {
            if (host && host.readyState === WebSocket.OPEN) {
                host.send(JSON.stringify(data));
            }
        }
    });

    ws.on("close", () => {
        if (ws === host) host = null;
        console.log("切断された");
    });
});

console.log("サーバー起動ポート:", port);