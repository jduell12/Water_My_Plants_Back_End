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
    },
    {
      name: "Eden",
      water_frequency: "1x/day",
      species: "",
      image: "",
      userid: 4,
    },
    {
      name: "WolfStar",
      water_frequency: "1x/week",
      species: "",
      image: "",
      userid: 1,
    },
    {
      name: "Sir McThirst",
      water_frequency: "1x/hour",
      species: "",
      image: "",
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
});
