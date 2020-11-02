const { expect, it } = require("@jest/globals");
const db = require("../db/dbConfig");
const Users = require("./usersModel");

//sample users to be used in tests
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

dbTestUsers = [
  {
    username: "wolf",
    password: "pass",
    email: "something@gmail.com",
    firstname: "Wolf",
    lastname: "Kelly",
    phone: "7345553323",
    userid: 1,
  },
  {
    username: "sam",
    password: "pass",
    email: "",
    firstname: "Sam",
    lastname: "Gamgee",
    phone: "7345523323",
    userid: 2,
  },
  {
    username: "dragon",
    password: "pass",
    email: "something@gmail.com",
    firstname: "A",
    lastname: "Dragon",
    phone: "",
    userid: 3,
  },
  {
    username: "penguin",
    password: "pass",
    email: "something@gmail.com",
    firstname: "",
    lastname: "",
    phone: "7345553333",
    userid: 4,
  },
];

describe("usersModel", () => {
  //wipes all tables in database clean so each test starts with empty tables
  beforeEach(async () => {
    //db is the knex initialized object using db.raw to truncate postgres tables with foreign keys
    //can use knex.raw but it is global and deprecated
    await db.raw("TRUNCATE TABLE plants RESTART IDENTITY CASCADE");
    await db.raw("TRUNCATE TABLE users RESTART IDENTITY CASCADE");
  });

  //gets all users from database
  describe("getUsers()", () => {
    it("gets an empty array of users from empty db", async () => {
      const users = await Users.getUsers();
      expect(users).toHaveLength(0);
    });

    it("gets an array of users from a non-empty db", async () => {
      await db("users").insert({
        username: "wolf",
        password: "pass",
        email: "something@gmail.com",
        firstname: "Wolf",
        lastname: "Kelly",
        phone: "7345553323",
      });
      await db("users").insert({
        username: "sam",
        password: "pass",
        email: "",
        firstname: "Sam",
        lastname: "Gamgee",
        phone: "7345523323",
      });
      await db("users").insert({
        username: "dragon",
        password: "pass",
        email: "something@gmail.com",
        firstname: "A",
        lastname: "Dragon",
        phone: "",
      });
      await db("users").insert({
        username: "penguin",
        password: "pass",
        email: "something@gmail.com",
        firstname: "",
        lastname: "",
        phone: "7345553333",
      });

      const users = await Users.getUsers();
      const dbUsers = await db("users");
      expect(users).toHaveLength(4);
      expect(users).toEqual(dbUsers);
    });
  });

  //adds users to the database
  describe("addUsers", () => {
    it("adds a user to an empty db", async () => {
      await Users.addUser(user1);

      const users = await db("users");
      const shouldGet = [dbTestUsers[0]];

      expect(users).toHaveLength(1);
      expect(users).toEqual(shouldGet);
    });

    it("adds a user to a non-empty db", async () => {
      await db("users").insert(user1);
      await db("users").insert(user2);
      await db("users").insert(user3);
      await Users.addUser(user4);

      const users = await db("users");

      expect(users).toHaveLength(4);
      expect(users).toEqual(dbTestUsers);
    });
  });
});
