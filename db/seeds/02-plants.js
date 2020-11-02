exports.seed = function (knex) {
  return knex("plants").insert([
    {
      name: "Franky",
      water_frequency: "1x month",
      species: "Crassula ovata",
      image: "",
      userid: 1,
    },
  ]);
};
