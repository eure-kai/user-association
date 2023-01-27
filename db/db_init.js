
// (Re)Sets up the database, including a little bit of sample data
const db = require("./db_connection");

/**** Delete existing table, if any ****/

const drop_stuff_table_sql = "DROP TABLE IF EXISTS `stuff`;"
db.execute(drop_stuff_table_sql);

/**** Create "stuff" table (again)  ****/

const create_stuff_table_sql = `
    CREATE TABLE planner (
        id INT NOT NULL AUTO_INCREMENT,
        eventName VARCHAR(45) NOT NULL,
        description VARCHAR(150) NULL,
        time VARCHAR(45) NULL,
        location VARCHAR(45) NULL,
        PRIMARY KEY (id)
    );
`
db.execute(create_stuff_table_sql);


/**** Create some sample items ****/
const insert_stuff_table_sql = `
    INSERT INTO planner 
        (eventName, description, time, location) 
    VALUES 
        (?, ?, ?, ?);
`

db.execute(insert_stuff_table_sql, ['Mr. Krabs', 'Walk my dog after I eat breakfast', '10:00-10:30 AM', 'Lions Park']);

db.execute(insert_stuff_table_sql, ['Tony\'\s party', 'My best friend\'\s birthday party!', '1:00-5:30 PM', 'Palisades Mall']);

db.execute(insert_stuff_table_sql, ['Finish Spanish Project', 'Need to finish homework after dinner', '7:00-9:00 PM', 'My house']);

db.execute(insert_stuff_table_sql, ['Submit essay', 'i hate english', null, null]);


/**** Read the sample items inserted ****/

const read_stuff_table_sql = "SELECT * FROM planner";

db.execute(read_stuff_table_sql, 
    (error, results) => {
        if (error) 
            throw error;

        console.log("Table 'planner' initialized with:")
        console.log(results);
    }
);

db.end();

