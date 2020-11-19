const db = require("../db/dbConfig");

module.exports = {
  addUser,
  editUser,
  getUsers,
  deleteUser,
  getUserById,
  getUserByUsername,
};

//adds a user to the database
function addUser(user) {
  return db("users").insert(user, "userid");
}

//edits user with the given id
function editUser(userEdits, userid) {
  return db("users")
    .where({ userid })
    .update(userEdits)
    .then((count) => {
      return count;
    });
}

//gets all users from the database
function getUsers() {
  return db("users");
}

//removes user with given id from database and returns the number of records changed
function deleteUser(userid) {
  return db("users").del().where({ userid });
}

//returns user object corresponding to the given id
function getUserById(userid) {
  return db("users").where({ userid }).first();
}

//returns user object corresponding to the given username
function getUserByUsername(username) {
  return db("users").where({ username });
}
