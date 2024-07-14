import express from 'express';
import path from "path";
import cors from 'cors';
import { Server } from "socket.io";
import { formatMessage } from './utils/messages.js';
import { userJoin, getCurrentUser, listAfterUserLeave, getRoomUsers } from "./utils/users.js";

const bot = 'mod';

const app = express();

const corsOptions = {
  origin: '/',
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  allowedHeaders: 'Content-Type,Authorization',
  credentials: true
};

app.use(cors(corsOptions), {
  transports: ['websocket', 'polling'],
  allowEIO3: true
});

app.use(express.static(path.join(import.meta.url, '/../public')));
console.log(path.join(import.meta.url, '/../public'));

const port = process.env.port || 8080;

const server = app.listen(port, () => {
  console.log(`listening on port ${port}`);
});

const io = new Server(server);

io.on('connection', socket => {

  console.log('someone connected')

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

io.engine.on("connection_error", (err) => {
  console.log("server.js connection_error")
  console.log(err.req);      // the request object
  console.log(err.code);     // the error code, for example 1
  console.log(err.message);  // the error message, for example "Session ID unknown"
  console.log(err.context);  // some additional error context
});