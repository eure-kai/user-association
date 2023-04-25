// (Re)Sets up the database, including a little bit of sample data
const db = require("./db_connection");

//for queries
const path = require("path");
const fs = require("fs");


/**** Read the categories table ****/

const select_categories_sql = fs.readFileSync(path.join(__dirname, "db", "queries", "init", "select_categories.sql"), {encoding: "UTF-8"});

db.execute(select_categories_sql, 
    (error, results) => {
        if (error) 
            throw error;

        console.log("Table 'categories' contents:")
        console.log(results);
    }
);

/**** Read the tasks table ****/

const select_tasks_sql = fs.readFileSync(path.join(__dirname, "db", "queries", "init", "select_tasks.sql"), {encoding: "UTF-8"});

db.execute(select_tasks_sql, 
    (error, results) => {
        if (error) 
            throw error;

        console.log("Table 'tasks' contents:")
        console.log(results);
    }
);

db.end();