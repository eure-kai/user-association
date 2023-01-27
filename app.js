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
app.get( "/planner", ( req, res) => {
    res.sendFile( __dirname + "/views/planner.html" );
} );

//define a route for the event page
app.get( "/planner/event", ( req, res ) => {
    res.sendFile( __dirname + "/views/event.html" );
} );


// start the server
app.listen( port, () => {
    console.log(`App server listening on ${ port }. (Go to http://localhost:${ port })` );
} );