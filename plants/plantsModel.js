const db = require("../db/dbConfig");

module.exports = {
  addPlant,
  editPlant,
  deletePlant,
};

//adds a plant and returns the id of the new plant object in the database
function addPlant(plant) {
  return db("plants").insert(plant, "plantid");
}

//edits plant with given id and returns the count of records changed
function editPlant(plantid, plantEdits) {
  return db("plants")
    .where({ plantid })
    .update(plantEdits)
    .then((count) => {
      return count;
    });
}

//removes the plant object with the given id from the database and returns the number of records changed
function deletePlant(plantid) {
  return db("plants").del().where({ plantid });
}
