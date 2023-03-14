
const db = require('./db/db_pool.js');

//set up the server
const express = require( "express" );
const app = express();
const port = process.env.PORT || 8080;

//Configure Express to use EJS
app.set( "views",  __dirname + "/views");
app.set( "view engine", "ejs" );

//import morgan
const logger = require("morgan");

//configure helmet
const helmet = require("helmet");

app.use(helmet({
    contentSecurityPolicy: {
        directives: {
            defaultSrc: ["'self'"],
            scriptSrc: ["'self'", 'cdnjs.cloudflare.com']
        }
    }
}));

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
const read_planner_all_sql = `
    SELECT
        id, eventName, description, time, location
    FROM
        planner
`

app.get( "/planner", ( req, res) => {
    db.execute(read_planner_all_sql, (error, results) => {
        if (error)
            res.status(500).send(error);
        else   
            res.render('planner', { inventory : results });  
    });
});


//define a route for the event page
const read_event_sql = `
    SELECT
        id, eventName, description, time, location
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
            res.status(404).send(`No event found with id = "${req.params.id}"` ); // NOT FOUND
        else {
            let data = results[0];
            //  { id: ___, item: ___ , quantity:___ , description: ____ }
            res.render('event', data);
        }
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



//define a route for the event create
const create_event_sql = `
    INSERT INTO planner
        (eventName, description)
    VALUES
        (?, ?)
`

app.post("/planner", ( req, res ) => {
    db.execute(create_event_sql, [req.body.eventName, req.body.description], (error, results) => {
        if (error)
            res.status(500).send(error); //Internal Server Error
        else 
            //results.insertId has the primary key (id) of the newly inserted element.
            res.redirect(`/planner/event/${results.insertId}`);
    });
})


// define a route for event UPDATE
const update_event_sql = `
    UPDATE
        planner
    SET
        eventName = ?,
        description = ?,
        time = ?,
        location = ?
    WHERE
        id = ?
`
app.post("/planner/event/:id", ( req, res ) => {
    db.execute(update_event_sql, [req.body.eventName, req.body.description, req.body.time, req.body.location, req.params.id], (error, results) => {
        if (error)
            res.status(500).send(error); //Internal Server Error
        else
            res.redirect(`/planner/event/${req.params.id}`);
        
    });
})


// start the server
app.listen( port, () => {
    console.log(`App server listening on ${ port }. (Go to http://localhost:${ port })` );
} );