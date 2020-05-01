var shortid = require("shortid");

var low = require("lowdb");
var FileSync = require("lowdb/adapters/FileSync");
var adapter = new FileSync("db.json");
var db = low(adapter);

db.defaults({ users: [], books: [], transactions: [], sessions: [] ,count: 0 })
  .write()

module.exports = db;

