import express from 'express';
import path from "path";
import http from "http";
import cors from 'cors';
import { Server } from "socket.io";
import { formatMessage } from './utils/messages.js';
import { userJoin, getCurrentUser, listAfterUserLeave, getRoomUsers } from "./utils/users.js";

const bot = 'mod';

const app = express();

const corsOptions = {
  origin: 'https://socketchat-io.netlify.app',
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  allowedHeaders: 'Content-Type,Authorization',
};

app.use(cors(corsOptions));

app.use(express.static(path.join(import.meta.url, '/../public')));
console.log(path.join(import.meta.url, '/../public'));

const server = http.createServer(app);
const io = new Server(server);

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
