import { io } from "https://cdn.socket.io/4.4.1/socket.io.esm.min.js";
  
const socket = io();
console.log(socket);

const chatFormElement = document.getElementById('chat-form');
const roomNameElement = document.getElementById('room-name');
const usersElement = document.getElementById("users");
const chatMessages = document.querySelector('.chat-messages');

const urlParams = new URLSearchParams(window.location.search);
const currentUser = urlParams.get("username");
const room = urlParams.get("room");
console.log(urlParams);

console.log(socket);

socket.emit('joinRoom', { username: currentUser, room });

socket.on("message", (message) => {

  console.log(socket);

  outputMessage(message);
  chatMessages.scrollTop = chatMessages.scrollHeight;
});

console.log(socket);

socket.on('roomUsers', ({ room, users }) => {

  console.log(socket);

  outputRoomName(room);
  outputUsers(users);
});

console.log(socket);

chatFormElement.addEventListener('submit', (e) => {
  e.preventDefault();
  const msg = e.target.elements.msg.value;
  socket.emit('chatMessage', msg);

  e.target.elements.msg.value = "";
  e.target.elements.msg.focus();
});

console.log(socket);

const outputMessage = ( { username, text, time } ) => {
  const div = document.createElement("div");
  div.classList.add('message');
  if (username === currentUser) {
    div.classList.add('my-message');
  } else {
    div.classList.add("other-messsage");
  }
  div.innerHTML = `<p class='meta'>${username} <span>${time}</span></p>
    <p class='text'> ${text} </p>`;
  document.querySelector('.chat-messages').appendChild(div);
}

const outputRoomName = ( room ) => {
  roomNameElement.innerHTML = room;
}

const outputUsers = ( users ) => {
  usersElement.innerHTML = users.map(user => {
    return `<li>${user.username}</li>`
  }).join('');
}

console.log(socket);

socket.on("connect_error", (err) => {
  // the reason of the error, for example "xhr poll error"
  console.log(err.message);

  // some additional description, for example the status code of the initial HTTP response
  console.log(err.description);

  // some additional context, for example the XMLHttpRequest object
  console.log(err.context);
});