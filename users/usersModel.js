const db = require("../db/dbConfig");

module.exports = { addUser, editUser, getUsers };

//adds a user to the database
function addUser() {}

//edits user with the given id
function editUser(userId) {}

//gets all users from the database
function getUsers() {
  return db("users");
}
