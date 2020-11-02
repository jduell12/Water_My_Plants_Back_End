const { it, expect, beforeEach } = require("@jest/globals");
const db = require("../db/dbConfig");
const Users = require("./usersModel");

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
});
