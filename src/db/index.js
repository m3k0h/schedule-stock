const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./stock.db'); // o donde tengas tu DB

db.serialize(() => {
    db.run(`CREATE TABLE IF NOT EXISTS weed (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        nombre TEXT UNIQUE,
        stock INTEGER
    )`);
});

module.exports = db;
