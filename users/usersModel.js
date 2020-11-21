const db = require("../db/dbConfig");

module.exports = {
  addUser,
  editUser,
  getUsers,
  deleteUser,
  getUserBy,
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

//returns user object corresponding to the given filter and filter value
async function getUserBy(filterName, filterValue) {
  switch (filterName) {
    case "username":
      return db("users").where({ username: filterValue }).first();
    case "userid":
      return db("users").where({ userid: filterValue }).first();
    case "password":
      return db("users").where({ password: filterValue });
    case "email":
      return db("users").where({ email: filterValue });
    case "firstname":
      return db("users").where({ firstname: filterValue });
    case "lastname":
      return db("users").where({ lastname: filterValue });
    case "phone":
      return db("users").where({ phone: filterValue });
    default:
      return false;
  }
}
