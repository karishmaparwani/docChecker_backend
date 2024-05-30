const dbConfig = require("../config/db.config");
const mongoose = require("mongoose");

const db = {};

db.mongoose = mongoose;
db.connUrl = dbConfig.url;

// Import Models
const { Users, ROLES } = require("./users.model");
db.Users = Users
db.ROLES = ROLES;

module.exports = db;
