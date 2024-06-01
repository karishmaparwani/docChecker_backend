const dbConfig = require("../config/db.config");
const mongoose = require("mongoose");
const { Users, ROLES, USER_ACTIVATION_STATUS } = require("./users.model");
const { Reviews } = require("./reviews.model");

const db = {};

db.mongoose = mongoose;
db.connUrl = dbConfig.url;

// Import Models
db.Users = Users;
db.ROLES = ROLES;
db.USER_ACTIVATION_STATUS = USER_ACTIVATION_STATUS;
db.Reviews = Reviews;

module.exports = db;
