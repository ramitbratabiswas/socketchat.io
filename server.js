import express from 'express';
import dotenv from 'dotenv';
import path from "path";
import http from "http";
import * as socketio from "socket.io";

dotenv.config();

const app = express();
app.use(express.static(path.join(import.meta.dirname, 'public')));

const server = http.createServer(app);
const io = new socketio.Server(server);

io.on('connection', socket => {
  console.log('new websocket connection...');
  socket.emit('message', 'welcome!!!');

  socket.broadcast.emit('message', 'whats your eta');
  io.emit('message', 'stay in the middle like you a little');

  socket.on('disconnect', () => {
    io.emit('message', 'a user has left the chat');
  });

  socket.on('chatMessage', (msg) => {
    io.emit('message',msg);
  })

})

const port = process.env.PORT || 3000;

server.listen(port, () => {
  console.log(`listening on port ${port}`);
});
