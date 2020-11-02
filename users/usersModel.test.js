const db = require("../db/dbConfig");
const Users = require('./usersModel')

describe("usersModel", ()=>{
    //wipes all tables in database clean so each test starts with empty tables 
    await db('users').truncate();
    await db('plants').truncate();

    //gets all users from database
    describe('getUsers()', ()=>{
        
    })
})
