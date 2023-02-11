
const db = require('./db/db_connection.js');

//set up the server
const express = require( "express" );
const app = express();
const port = 8080;

//Configure Express to use EJS
app.set( "views",  __dirname + "/views");
app.set( "view engine", "ejs" );

//import morgan
const logger = require("morgan");

// define middleware that logs all incoming requests
app.use(logger("dev"));
app.use(express.static(__dirname + '/public'));
// Configure Express to parse URL-encoded POST request bodies (traditional forms)
app.use( express.urlencoded({ extended: false }) );

// define a route for the default home page
app.get( "/", ( req, res ) => {
    res.render('index');
});

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
            res.render('planner', { inventory : results });  
    });
});

//define a route for the event delete
const delete_event_sql = `
    DELETE
    FROM
        planner
    WHERE
        id = ?
`

app.get("/planner/event/:id/delete", ( req, res ) => {
    db.execute(delete_event_sql, [req.params.id], (error, results) => {
        if (error)
            res.status(500).send(error);
        else
            res.redirect("/planner");    
    });
})


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
            res.status(500).send(error); //Internal Server Error
        else if (results.length == 0)
            res.status(404).send(`No item found with id = "{req.params.id}"`);    
        else {
            let data = results[0]; //results is still an array
            //data's object structure:
            // { eventName: ___ , description: ____, time: ____, location: ____}
            res.render('event', data);
        }  
    });        
});


// start the server
app.listen( port, () => {
    console.log(`App server listening on ${ port }. (Go to http://localhost:${ port })` );
} );