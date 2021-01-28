const router = require("express").Router();
const Users = require("./usersModel");

router.get("/getByUsername", (req, res) => {
  const username = req.jwt.username;
  Users.getUserBy("username", username)
    .then((user) => {
      res.status(200).json({ user });
    })
    .catch((err) => {
      res
        .status(500)
        .json({ error: err.message, message: "Could not retrieve that user" });
    });
});

router.put("/editUser", (req, res) => {
  const username = req.jwt.username;
  const changes = req.body;

  Users.getUserBy("username", username)
    .then((user) => {
      Users.editUser(user.userid, changes)
        .then((count) => {
          res
            .status(200)
            .json({ message: `Edited ${count} student successfully` });
        })
        .catch((err) => {
          res
            .status(500)
            .json({ err: err.message, message: "Could not edit that user" });
        });
    })
    .catch((err) =>
      res
        .status(500)
        .json({ error: err.message, message: "No user with that username" }),
    );
});

router.delete("/", async (req, res) => {
  const username = req.jwt.username;

  Users.getUserBy("username", username)
    .then((user) => {
      Users.deleteUser(user.userid)
        .then((delUser) => {
          res.status(200).json({ message: `${delUser} deleted successfully` });
        })
        .catch((err) => {
          res
            .status(406)
            .json({ message: "No user with that username or id exists" });
        });
    })
    .catch((err) => {
      res
        .status(500)
        .json({ error: err.message, message: "Could not retrieve that user" });
    });
});

module.exports = router;
