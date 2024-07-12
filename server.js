import express from 'express';
import dotenv from 'dotenv';
import path, { dirname } from "path";
import http from "http";
import { Server } from "socket.io";

dotenv.config();

const app = express();
app.use(express.static(path.join(import.meta.dirname, 'public')));

const server = http.createServer(app);
const io = new Server(server);

io.on('connection', socket => {
  console.log('new websocket connection...');
})

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`listening on port ${port}`);
});
