import express from 'express';
import dotenv from 'dotenv';
import path, { format } from "path";
import http from "http";
import * as socketio from "socket.io";
import { formatMessage } from './utils/messages.js';

dotenv.config();

const bot = 'mod';

const app = express();
app.use(express.static(path.join(import.meta.dirname, 'public')));

const server = http.createServer(app);
const io = new socketio.Server(server);

io.on('connection', socket => {
  console.log('new websocket connection...');
  socket.emit('message', formatMessage(bot, 'welcome kitten'));

  socket.broadcast.emit('message', 'whats your eta');

  socket.on('disconnect', () => {
    io.emit(formatMessage(bot, 'a kitten has left'));
  });

  socket.on('chatMessage', (msg) => {
    io.emit('message', msg);
  })

})

const port = process.env.PORT || 3000;

server.listen(port, () => {
  console.log(`listening on port ${port}`);
});
