const dbConfig = require("../config/db.config");
const mongoose = require("mongoose");
const Users = require("./users.model");
const Reviews = require("./reviews.model");

const db = {};

db.mongoose = mongoose;
db.connUrl = dbConfig.url;

// Import Models
db.Users = Users;
db.Reviews = Reviews;

module.exports = db;
