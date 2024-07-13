const socket = io();
const chatForm = document.getElementById('chat-form');
const roomName = document.getElementById('room-name');
const users = document.getElementById("users");
const loggedinUsers = [];
const chatMessages = document.querySelector('.chat-messages');

const urlParams = new URLSearchParams(window.location.search);
const username = urlParams.get("username");
const room = urlParams.get("room");

socket.on("message", (message) => {
  outputMessage(message);
  loggedinUsers.push(username);
  chatMessages.scrollTop = chatMessages.scrollHeight;
  roomName.innerHTML = room;
});

chatForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const msg = e.target.elements.msg.value;
  socket.emit('chatMessage', msg);

  e.target.elements.msg.value = "";
  e.target.elements.msg.focus();
});

const outputMessage = ( { username, text, time } ) => {
  const div = document.createElement("div");
  div.classList.add('message');
  div.innerHTML = `<p class='meta'>${username} <span>${time}</span></p>
    <p class='text'> ${text} </p>`;
  document.querySelector('.chat-messages').appendChild(div);
}