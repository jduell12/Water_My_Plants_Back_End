exports.up = function (knex) {
  return knex.schema
    .createTable("users", (tbl) => {
      tbl.increments("userid");
      tbl.string("username", 256).notNullable().unique();
      tbl.string("password", 256).notNullable();
      tbl.string("email", 256);
      tbl.string("firstname", 256);
      tbl.string("lastname");
      tbl.string("phone");
    })
    .createTable("plants", (tbl) => {
      tbl.increments("plantid");
      tbl.string("name", 256).notNullable();
      tbl.string("water_frequency", 256).notNullable();
      tbl.string("species", 256);
      tbl.string("image", 256);
      tbl
        .integer("userid")
        .unsigned()
        .references("users.userid")
        .onDelete("CASCADE")
        .onUpdate("CASCADE");
    });
};

exports.down = function (knex) {
  return knex.schema.dropTableIfExists("plants").dropTableIfExists("users");
};
