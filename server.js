import express from 'express';
import path from "path";
import http from "http";
import * as socketio from "socket.io";
import { formatMessage } from './utils/messages.js';
import { userJoin, getCurrentUser, listAfterUserLeave, getRoomUsers } from "./utils/users.js";

const bot = 'mod';

const app = express();
app.use(express.static(path.join(import.meta.url, 'public')));

const server = http.createServer(app);
const io = new socketio.Server(server);

io.on('connection', socket => {

  socket.on('joinRoom', ({ username, room }) => {

    const user = userJoin(socket.id, username, room);
    socket.emit('message', formatMessage(bot, 'welcome kitten'));
    socket.broadcast.emit('message', formatMessage(bot, `a new kitten, ${user.username}, has joined`));
    io.emit('roomUsers', { room: user.room, users: getRoomUsers(user.room) });
 
  });

  socket.on('chatMessage', (msg) => {
    const user = getCurrentUser(socket.id);
    io.emit('message', formatMessage(user.username, msg));
  });

  socket.on('disconnect', () => {
    const user = getCurrentUser(socket.id);
    
    if (user) {
      io.emit('message', formatMessage(bot, `a kitten, ${user.username}, has left`));
      io.to(user.room).emit('roomUsers', { room: user.room, users: listAfterUserLeave(user).filter(elem => elem.room === user.room) });
    }

  });

})

const port = process.env.port || 8080;

server.listen(port, () => {
  console.log(`listening on port ${port}`);
});
