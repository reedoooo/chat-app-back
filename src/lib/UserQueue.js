const { v4: uuidv4 } = require('uuid');

class UserQueue {
  constructor() {
    this.users = [];
  }

  addUser(user) {
    user.id = uuidv4();
    this.users.push(user);
    return users;
  }

  removeUser(userId) {
    this.users = this.users.filter(user => user.id !== userId);
  }

  // read(turnId) {
  //   return this.players.find(player => player.id === turnId);
  // }
}

module.exports = UserQueue;
