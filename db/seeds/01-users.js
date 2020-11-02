exports.seed = function (knex) {
  return knex("users").insert([
    {
      userid: 1,
      username: "user",
      password: "pass",
      email: "something@gmail.com",
      firstname: "Aname",
      lastname: "Zname",
      phone: "734-557-3323",
    },
  ]);
};
