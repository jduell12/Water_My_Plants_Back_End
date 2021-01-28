const router = require("express").Router();
const Users = require("../users/usersModel");
const Plants = require("./plantsModel");
const { plantValid } = require("./helper");

router.get("/", (req, res) => {
  const username = req.jwt.username;

  Users.getUserBy("username", username)
    .then((user) => {
      Plants.getPlantBy("userid", user.userid)
        .then((plants) => {
          res.status(200).json(plants);
        })
        .catch((err) => {
          res.status(500).json({
            error: err.message,
            message: "Could not retrieve plants for that user",
          });
        });
    })
    .catch((err) => {
      res.status(500).json({
        error: err.message,
        message: "Could not retrieve that user",
      });
    });
});

router.post("/addPlant", (req, res) => {
  const username = req.jwt.username;

  if (plantValid(req.body)) {
    Users.getUserBy("username", username)
      .then((user) => {
        const plant = req.body;
        plant.userid = user.userid;
        Plants.addPlant(plant)
          .then((addedPlantId) => {
            res
              .status(201)
              .json({ message: "Plant added successfully", addedPlantId });
          })
          .catch((err) => {
            res.status(500).json({
              err: err.message,
              message: "Could not add plant",
            });
          });
      })
      .catch((err) =>
        res.status(500).json({
          err: err.message,
          message: "Could not retrive that user from the database",
        }),
      );
  } else {
    res.status(400).json({
      message:
        "Please fill out a plant name and water frequency to add the plant",
    });
  }
});

router.put("/editPlant/:plantId", (req, res) => {
  const plantId = req.params.plantId;
  const edits = req.body;

  Plants.editPlant(plantId, edits)
    .then((count) => {
      res.status(200).json({ message: `Edited ${count} plant successfully` });
    })
    .catch((err) =>
      res.status(500).json({
        error: err.message,
        message: "Could not edit the plant with the given id",
      }),
    );
});

router.delete("/:plantId", (req, res) => {
  Plants.deletePlant(req.params.plantId)
    .then((count) => {
      res.status(200).json({ message: `Deleted ${count} plant successfully` });
    })
    .catch((err) => {
      res
        .status(500)
        .json({
          err: err.message,
          message: "Could not delete the plant with the given plant id",
        });
    });
});

module.exports = router;
