const dbConfig = require('../config/db.config')
const mongoose = require('mongoose');

const db = {};

db.mongoose = mongoose;
db.connUrl = dbConfig.url;

// Import Models
db.Users = require('./users.model');
db.Roles = require('./roles.model');

module.exports = db;
