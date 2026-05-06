const express = require("express");
const http = require("http");
const WebSocket = require("ws");
const { v4: uuidv4 } = require("uuid");
const db = require("./components/db");
const { runPipeline } = require("./components/pipeline");
const cors = require("cors");

const app = express();
app.use(express.json());
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

app.use(cors({ origin: "https://blockflowdemo.vercel.app" }));

const clients = new Map();

wss.on('connection', (ws) => {
    ws.on('message', (message) => {
        const data = JSON.parse(message);
        if (data.type === 'subscribe') clients.set(data.jobId, ws);
    });
});

app.post("/jobs", (req, res) => {
    const jobId = uuidv4();
    
    db.run('INSERT INTO jobs (id, status, progress) VALUES (?, "queued", 0)', [jobId], (err) => {
        if (err) return res.status(500).json({ error: err.message });

        res.json({ jobId });

        runPipeline(jobId, (update) => {
            const client = clients.get(jobId);
            if (client && client.readyState === WebSocket.OPEN) {
                client.send(JSON.stringify(update));
            }
        });
    });
});

app.get("/jobs/:id", (req, res) => {
    db.get('SELECT * FROM jobs WHERE id = ?', [req.params.id], (err, row) => {
        if (err || !row) return res.status(404).json({ error: "Job not found" });
        res.json(row); 
    });
});

server.listen(3000, () => console.log("Server running on port 3000"));
