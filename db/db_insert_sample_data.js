// (Re)Sets up the database, including a little bit of sample data
const db = require("./db_connection");

//for queries
const path = require("path");
const fs = require("fs");

/**** Delete *CONTENTS OF* existing tables (but not dropping tables themselves) ****/

const delete_tasks_table_sql = fs.readFileSync(path.join(__dirname, "queries", "init", "delete_tasks_table.sql"), {encoding: "UTF-8"});
db.execute(delete_tasks_table_sql);

const delete_categories_table_sql = fs.readFileSync(path.join(__dirname, "queries", "init", "delete_categories_table.sql"), {encoding: "UTF-8"});
db.execute(delete_categories_table_sql);


/**** Create some sample categories and tasks ****/

const insert_category_sql = fs.readFileSync(path.join(__dirname, "queries", "init", "insert_category.sql"), {encoding: "UTF-8"});

db.execute(insert_category_sql, [1, 'School Assignment']);
db.execute(insert_category_sql, [2, 'School TEST']);
db.execute(insert_category_sql, [3, 'Tutor HW']);
db.execute(insert_category_sql, [4, 'Extracurriculars']);


const insert_task_sql = fs.readFileSync(path.join(__dirname, "queries", "init", "insert_task.sql"), {encoding: "UTF-8"});

//categoryId: 4 --> Extracurriculars
db.execute(insert_task_sql, ['French Horn', 'Practice my instrument', 4, '2023-03-24', '17:00:00', '18:00:00', 'Lions Park']);

//categoryId: 3 --> Tutor HW
db.execute(insert_task_sql, ['Read book', 'Chapters 1-5', 3, '2023-03-24', '18:45:00', '19:30:00', 'Bed']);

//categoryId: 1 --> School Assignment
db.execute(insert_task_sql, ['Submit essay', 'i hate english but need to finish this', 1, '2023-03-25', null, null, null]);

//categoryId: 2 --> School TEST
db.execute(insert_task_sql, ['Study for Spanish Unit 2 test', 'Very important test', 2, '2023-03-26', '19:00:00', '20:00:00', 'Desk']);


db.execute(insert_category_sql, [5, 'Important Activity']);
db.execute(insert_category_sql, [6, 'Leisure Time']);


//categoryId: 6 --> Leisure Time
db.execute(insert_task_sql, ['Mr. Krabs', 'Walk my dog after I eat breakfast', 6, '2023-03-27',  '18:00:00', '18:30:00', 'Lions Park']);

//categoryId: 4 --> Extracurriculars
db.execute(insert_task_sql, ['Digital Electronics', 'Make presentation for comp sci club', 6, '2023-03-27',  '21:00:00', '21:30:00', 'Study Hall at school']);

//categoryId: 5 --> Important Activity
db.execute(insert_task_sql, ['Tony\'\s party', 'My best friend\'\s birthday party!', 5, '2023-03-31', '14:00:00', null, 'Palisades Mall']);

db.end();