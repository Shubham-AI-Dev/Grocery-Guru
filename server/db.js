require('dotenv').config();

const localStore = require('./models/store');

let db;
if (process.env.MONGODB_URI) {
  db = require('./models/mongoStore');
} else {
  db = localStore;
}

module.exports = db;
