
const db = require('./db/db_connection.js');

//set up the server
const express = require( "express" );
const app = express();
const port = 8080;

//import morgan
const logger = require("morgan");

// define middleware that logs all incoming requests
app.use(logger("dev"));
app.use(express.static(__dirname + '/public'));

// define a route for the default home page
app.get( "/", ( req, res ) => {
    res.sendFile( __dirname + "/views/index.html" );
} );

// define a route for the planner page
const read_planner_sql = `
    SELECT
        id, eventName, description, time, location
    FROM
        planner
`

app.get( "/planner", ( req, res) => {
    db.execute(read_planner_sql, (error, results) => {
        if (error)
            res.status(500).send(error);
        else   
            res.send(results);    
    });
});

//define a route for the event page
const read_event_sql = `
    SELECT
        eventName, description, time, location
    FROM
        planner
    WHERE
        id = ?
`
app.get( "/planner/event/:id", ( req, res ) => {
    db.execute(read_event_sql, [req.params.id], (error, results) => {
        if (error)
            res.status(500).send(error);
        else if (results.length == 0)
            res.status(404).send(`No item found with id = "{req.params.id}"`);    
        else   
            res.send(results[0]);
    });        
});


// start the server
app.listen( port, () => {
    console.log(`App server listening on ${ port }. (Go to http://localhost:${ port })` );
} );