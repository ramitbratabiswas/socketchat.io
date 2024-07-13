let users = [];

export const userJoin = (id, username, room) => {
  const user = { id, username, room };
  users.push(user);
  return user;
}

export const getCurrentUser = (id) => {
  return users.find(user => user.id === id);
}

export const listAfterUserLeave = (id) => {
  users = users.filter(user => user.id !== id);
  return users;
}

export const getRoomUsers = (room) => {
  return users.filter(user => user.room === room);
}