const db = require("../db/dbConfig");
const Plants = require("./plantsModel");

//sample plants to be used in tests
function getTestPlants() {
  return [
    {
      name: "Franky",
      water_frequency: "1x/month",
      species: "",
      image: "",
      userid: 3,
      plantid: 1,
    },
    {
      name: "Eden",
      water_frequency: "1x/day",
      species: "",
      image: "",
      userid: 4,
      plantid: 2,
    },
    {
      name: "WolfStar",
      water_frequency: "1x/week",
      species: "",
      image: "",
      userid: 1,
      plantid: 3,
    },
    {
      name: "Sir McThirst",
      water_frequency: "1x/hour",
      species: "iris",
      image: "",
      userid: 1,
      plantid: 4,
    },
  ];
}

//sample users to be used in tests
function getTestUsers() {
  const user1 = {
    username: "wolf",
    password: "pass",
    email: "something@gmail.com",
    firstname: "Wolf",
    lastname: "Kelly",
    phone: "7345553323",
  };
  const user2 = {
    username: "sam",
    password: "pass",
    email: "",
    firstname: "Sam",
    lastname: "Gamgee",
    phone: "7345523323",
  };
  const user3 = {
    username: "dragon",
    password: "pass",
    email: "something@gmail.com",
    firstname: "A",
    lastname: "Dragon",
    phone: "",
  };
  const user4 = {
    username: "penguin",
    password: "pass",
    email: "something@gmail.com",
    firstname: "",
    lastname: "",
    phone: "7345553333",
  };

  users = [user1, user2, user3, user4];

  return users;
}

describe("usersModel", () => {
  //wipes all tables in database clean so each test starts with empty tables
  beforeEach(async () => {
    //db is the knex initialized object using db.raw to truncate postgres tables with foreign keys
    //can use knex.raw but it is global and deprecated
    await db.raw("TRUNCATE TABLE plants RESTART IDENTITY CASCADE");
    await db.raw("TRUNCATE TABLE users RESTART IDENTITY CASCADE");
  });

  describe("addPlant(plant)", () => {
    it("adds plant to empty database", async () => {
      let users = getTestUsers();
      let plants = getTestPlants();

      for (let i = 0; i < users.length; i++) {
        await db("users").insert(users[i]);
      }

      const dbUsers = await db("users");
      expect(dbUsers.length).toBe(4);

      let count = await Plants.addPlant(plants[1]);

      const dbPlants = await db("plants");
      expect(dbPlants.length).toBe(1);
    });

    it("adds plant non-empty database", async () => {
      let users = getTestUsers();
      let plants = getTestPlants();

      for (let i = 0; i < users.length; i++) {
        await db("users").insert(users[i]);
      }

      for (let i = 0; i < plants.length - 1; i++) {
        await db("plants").insert(plants[i]);
      }

      const dbUsers = await db("users");
      expect(dbUsers.length).toBe(4);

      let dbPlants = await db("plants");
      expect(dbPlants.length).toBe(3);

      let count = await Plants.addPlant(plants[3]);

      dbPlants = await db("plants");
      expect(dbPlants.length).toBe(4);
      expect(count).toEqual([4]);
    });
  });

  describe("editPlant(plantid, plantEdits)", () => {
    it("edits single plant in plants table", async () => {
      const users = getTestUsers();
      const plants = getTestPlants();
      let expectedPlant = plants[0];
      expectedPlant.species = "Succulent";

      for (let i = 0; i < users.length; i++) {
        await db("users").insert(users[i]);
      }

      await db("plants").insert(plants[0]);

      const dbUsers = await db("users");
      let dbPlants = await db("plants");

      expect(dbUsers.length).toBe(4);
      expect(dbPlants.length).toBe(1);

      const edit = await Plants.editPlant(1, { species: "Succulent" });
      expect(edit).toBe(1);

      dbPlants = await db("plants");
      expect(dbPlants).toEqual([expectedPlant]);
    });

    it("edits single plant in a populated plants table", async () => {
      const users = getTestUsers();
      const plants = getTestPlants();
      let expectedPlant = plants[0];
      expectedPlant.species = "Succulent";
      expectedPlant.plantid = 1;

      for (let i = 0; i < users.length; i++) {
        await db("users").insert(users[i]);
      }

      for (let i = 0; i < plants.length; i++) {
        await db("plants").insert(plants[i]);
      }
      const dbUsers = await db("users");
      let dbPlants = await db("plants");
      expect(dbUsers.length).toBe(4);
      expect(dbPlants.length).toBe(4);

      const edit = await Plants.editPlant(1, { species: "Succulent" });
      expect(edit).toBe(1);

      dbPlants = await db("plants").where({ plantid: 1 });
      expect(dbPlants).toEqual([expectedPlant]);
    });
  });

  describe("deletePlant(plantid)", () => {
    it("deletes plant from plant table with only 1 plant", async () => {
      const users = getTestUsers();
      const plants = getTestPlants();
      let expectedPlant = plants[0];
      expectedPlant.species = "Succulent";

      for (let i = 0; i < users.length; i++) {
        await db("users").insert(users[i]);
      }

      await db("plants").insert(plants[0]);

      const dbUsers = await db("users");
      let dbPlants = await db("plants");

      expect(dbUsers.length).toBe(4);
      expect(dbPlants.length).toBe(1);

      const count = await Plants.deletePlant(1);
      dbPlants = await db("plants");

      expect(count).toEqual(1);
      expect(dbPlants).toEqual([]);
    });

    it("deletes plant from populated plant table", async () => {
      const users = getTestUsers();
      const plants = getTestPlants();
      const expectedPlants = [plants[0], plants[1], plants[2]];

      for (let i = 0; i < users.length; i++) {
        await db("users").insert(users[i]);
      }

      for (let i = 0; i < plants.length; i++) {
        await db("plants").insert(plants[i]);
      }

      const dbUsers = await db("users");
      let dbPlants = await db("plants");

      expect(dbUsers.length).toBe(4);
      expect(dbPlants.length).toBe(4);

      const count = await Plants.deletePlant(4);
      dbPlants = await db("plants");

      expect(count).toEqual(1);
      expect(dbPlants.length).toEqual(3);
      expect(dbPlants).toEqual(expectedPlants);
    });

    it("returns 0 when trying to delete a plant that does not exist", async () => {
      const users = getTestUsers();
      const plants = getTestPlants();

      for (let i = 0; i < users.length; i++) {
        await db("users").insert(users[i]);
      }

      for (let i = 0; i < plants.length; i++) {
        await db("plants").insert(plants[i]);
      }

      const dbUsers = await db("users");
      let dbPlants = await db("plants");

      expect(dbUsers.length).toBe(4);
      expect(dbPlants.length).toBe(4);

      const count = await Plants.deletePlant(5);
      dbPlants = await db("plants");
      expect(count).toBe(0);
      expect(dbPlants.length).toBe(4);
    });
  });

  describe("getPlantBy(filterName, filterValue)", () => {
    beforeEach(async () => {
      const users = getTestUsers();
      const plants = getTestPlants();

      for (let i = 0; i < users.length; i++) {
        await db("users").insert(users[i]);
      }

      for (let i = 0; i < plants.length; i++) {
        await db("plants").insert(plants[i]);
      }

      const dbUsers = await db("users");
      let dbPlants = await db("plants");

      expect(dbUsers.length).toBe(4);
      expect(dbPlants.length).toBe(4);
    }); //end of beforeEach

    it("gets list of plant objects by given name", async () => {
      const plants = getTestPlants();
      const plant = await Plants.getPlantBy("name", "Franky");
      expect(plant).toEqual([plants[0]]);
    });

    it("returns empty array when trying to get a plant by a name that's not in the database", async () => {
      const plant = await Plants.getPlantBy("name", "Frankie");
      expect(plant).toEqual([]);
    });

    it("gets list of plant objects by given water frequency", async () => {
      const plants = getTestPlants();
      const plant = await Plants.getPlantBy("water_frequency", "1x/week");
      expect(plant).toEqual([plants[2]]);
    });

    it("returns empty array when trying to get a plant by water frequency that's not in the database", async () => {
      const plant = await Plants.getPlantBy("water_frequency", "10x/month");
      expect(plant).toEqual([]);
    });

    it("gets list of plant objects by given species", async () => {
      const plants = getTestPlants();
      const plant = await Plants.getPlantBy("species", "iris");
      expect(plant).toEqual([plants[3]]);
    });

    it("returns empty array when trying to get a plant by a species that's not in the database", async () => {
      const plant = await Plants.getPlantBy("species", "Frankie");
      expect(plant).toEqual([]);
    });

    it("gets list of plant objects by given userid", async () => {
      const plants = getTestPlants();
      const expectedPlants = [plants[2], plants[3]];
      const plant = await Plants.getPlantBy("userid", 1);
      expect(plant).toEqual(expectedPlants);
    });

    it("returns empty array when trying to get a plant by a user that's not in the database", async () => {
      const plant = await Plants.getPlantBy("userid", 10);
      expect(plant).toEqual([]);
    });
  }); //end getBy tests
});
