const db = require("../db/dbConfig");
const Users = require("./usersModel");

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

//what should be returned from the db
function getExpectedTestUsers() {
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
  return dbTestUsers;
}

//async forEach method
async function asyncForEach(array, cb) {
  for (let i = 0; i < array.length; i++) {
    await cb(array[i], i, array);
  }
}

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
  describe("addUsers(user)", () => {
    it("adds a user to an empty db", async () => {
      let userList = getTestUsers();
      let dbTestUsers = getExpectedTestUsers();

      await Users.addUser(userList[0]);

      const users = await db("users");
      const shouldGet = [dbTestUsers[0]];

      expect(users).toHaveLength(1);
      expect(users).toEqual(shouldGet);
    });

    it("adds a user to a non-empty db", async () => {
      let list = getTestUsers();
      let userList = [list[0], list[1], list[2]];
      let dbTestUsers = getExpectedTestUsers();

      await asyncForEach(userList, async (user) => {
        await db("users").insert(user);
      });

      await Users.addUser(list[3]);
      const users = await db("users");

      expect(users).toHaveLength(4);
      expect(users).toEqual(dbTestUsers);
    });
  });

  //edits an existing user in the database
  describe("editUser(user, id)", () => {
    it("edits a user in a db with 1 entry", async () => {
      let users = getTestUsers();
      await db("users").insert(users[0]);

      const count = await Users.editUser(
        { email: "somethingElse@gmail.com" },
        1,
      );

      let expectedUser1 = dbTestUsers[0];
      expectedUser1.email = "somethingElse@gmail.com";
      const user = await db("users");

      expect(count).toBe(1);
      expect(user).toEqual([expectedUser1]);
    });

    it("edits a user in a db with more than 1 entry", async () => {
      let users = getTestUsers();
      await db("users").insert(users[0]);
      await db("users").insert(users[1]);
      await db("users").insert(users[2]);
      await db("users").insert(users[3]);

      const count = await Users.editUser(
        { email: "somethingElse@gmail.com" },
        3,
      );

      let expectedUsers = dbTestUsers;
      //change the email to the edited one we supplied
      expectedUsers[2].email = "somethingElse@gmail.com";
      //change the email to the original email that was changed in previous test
      expectedUsers[0].email = "something@gmail.com";

      const dbusers = await db("users");

      expect(count).toBe(1);
      expect(dbusers).toEqual(expect.arrayContaining(expectedUsers));
    });
  });

  //deletes an existing user from the database
  describe("deleteUser(userid)", () => {
    it("deletes single user from database holding only 1 user", async () => {
      let users = getTestUsers();

      await db("users").insert(users[0]);
      let dbUsers = await db("users");
      expect(dbUsers.length).toBe(1);

      const count = await Users.deleteUser(1);
      dbUsers = await db("users");

      expect(count).toBe(1);
      expect(dbUsers).toEqual([]);
    });

    it("deletes single user from populated database", async () => {
      let users = getTestUsers();
      let expectedUsers = getExpectedTestUsers();
      expectedUsers.shift();

      for (let i = 0; i < users.length; i++) {
        await db("users").insert(users[i]);
      }

      let dbUsers = await db("users");
      expect(dbUsers.length).toBe(4);

      const count = await Users.deleteUser(1);
      dbUsers = await db("users");

      expect(count).toBe(1);
      expect(dbUsers).toEqual(expectedUsers);
    });
  });

  //returns user object corresponding to the userid
  describe("getUserById(userid)", () => {
    it("gets a user in a populated database by their userid", async () => {
      let users = getTestUsers();
      let expectedUsers = getExpectedTestUsers();

      for (let i = 0; i < users.length; i++) {
        await db("users").insert(users[i]);
      }

      let dbUsers = await db("users");
      expect(dbUsers.length).toBe(4);
      expect(dbUsers).toEqual(expectedUsers);

      let user1 = await Users.getUserById(1);
      expect(user1).toEqual(expectedUsers[0]);
    });

    it("returns false when trying to get user that's not in the database", async () => {
      let users = getTestUsers();
      let expectedUsers = getExpectedTestUsers();

      for (let i = 0; i < users.length - 1; i++) {
        await db("users").insert(users[i]);
      }
      let dbUsers = await db("users");
      expect(dbUsers.length).toBe(3);

      let user4 = await Users.getUserById(4);
      expect(user4).toBe(false);
    });
  });

  //returns user object corresponding to the username
  describe("getUserByUsername(username)", () => {});
});
