const router = require("express").Router();
const bcryptjs = require("bcryptjs");

const Users = require("../users/usersModel");
const { signToken, userValid } = require("./helpers");

router.post("/register", (req, res) => {
  const user = req.body;

  if (userValid(user)) {
    const rounds = parseInt(process.env.BCRYPT_ROUNDS) || 12;
    //hash password
    const hash = bcryptjs.hashSync(user.password, rounds);
    user.password = hash;

    //adds user to database
    Users.addUser(user)
      .then(() => {
        const token = signToken(user);
        res.status(201).json({ token });
      })
      .catch((e) => {
        res.status(500).json({
          error: e.message,
          error_message: "Couldn't add user to the database",
        });
      });
  } else {
    res
      .status(400)
      .json({ message: "Please provide a username and a password" });
  }
});

router.post("/login", (req, res) => {
  if (userValid(req.body)) {
    const { username, password } = req.body;

    Users.getUserBy("username_login", username)
      .then((user) => {
        if (user && bcryptjs.compareSync(password, user.password)) {
          const token = signToken(user);
          res.status(200).json({ message: "Welcome", token });
        } else {
          res.status(401).json({ message: "Invalid credentials" });
        }
      })
      .catch((e) => {
        res.status(500).json({
          e: e.message,
          error_message: "Could not retrieve user from database",
        });
      });
  } else {
    res
      .status(400)
      .json({ message: "Please provide a username and a password" });
  }
});

module.exports = router;
