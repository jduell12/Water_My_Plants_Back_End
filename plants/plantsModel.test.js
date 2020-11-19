const db = require("../db/dbConfig");
const plants = require('./plantsModel')

//sample plants to be used in tests 
function getTestPlants(){
    return [
        {name: 'Franky',
        water_frequency: '1x/month',
        species: '',
        image: '',
        }, 
        {name: 'Eden',
        water_frequency: '1x/day',
        species: '',
        image: '',
        },
        {name: 'WolfStar',
        water_frequency: '1x/week',
        species: '',
        image: '',
        },
        {name: 'Sir McThirst',
        water_frequency: '1x/hour',
        species: '',
        image: '',
        }
    ]
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
}