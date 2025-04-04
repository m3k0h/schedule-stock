const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./db/database.sqlite3'); // o donde tengas tu DB

module.exports = db;
