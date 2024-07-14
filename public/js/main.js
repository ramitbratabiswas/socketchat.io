const socket = io(`localhost:8080`);
const chatFormElement = document.getElementById('chat-form');
const roomNameElement = document.getElementById('room-name');
const usersElement = document.getElementById("users");
const chatMessages = document.querySelector('.chat-messages');

const urlParams = new URLSearchParams(window.location.search);
const currentUser = urlParams.get("username");
const room = urlParams.get("room");

socket.emit('joinRoom', { username: currentUser, room });

socket.on("message", (message) => {
  outputMessage(message);
  chatMessages.scrollTop = chatMessages.scrollHeight;
});

socket.on('roomUsers', ({ room, users }) => {
  outputRoomName(room);
  outputUsers(users);
});

chatFormElement.addEventListener('submit', (e) => {
  e.preventDefault();
  const msg = e.target.elements.msg.value;
  socket.emit('chatMessage', msg);

  e.target.elements.msg.value = "";
  e.target.elements.msg.focus();
});

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