const db = require("./db_connection");

//for queries
const path = require("path");
const fs = require("fs");

/**** Drop existing tables, if any ****/

const drop_tasks_table_sql = fs.readFileSync(path.join(__dirname, "queries", "init", "drop_tasks_table.sql"), {encoding: "UTF-8"});
db.execute(drop_tasks_table_sql);

const drop_categories_table_sql = fs.readFileSync(path.join(__dirname, "queries", "init", "drop_categories_table.sql"), {encoding: "UTF-8"});
db.execute(drop_categories_table_sql);

/**** Create tables  ****/
const create_categories_table_sql = fs.readFileSync(path.join(__dirname, "queries", "init", "create_categories_table.sql"), {encoding: "UTF-8"});
db.execute(create_categories_table_sql);

const create_tasks_table_sql = fs.readFileSync(path.join(__dirname, "queries", "init", "create_tasks_table.sql"), {encoding: "UTF-8"});
db.execute(create_tasks_table_sql);

db.end();