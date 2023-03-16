
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

//configure auth
const { auth } = require('express-openid-connect');

const { requiresAuth } = require('express-openid-connect');

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

const dotenv = require('dotenv');
dotenv.config();

//CODE FROM AUTH0:
const config = {
    authRequired: false,
    auth0Logout: true,
    secret: process.env.AUTH0_SECRET,
    baseURL: process.env.AUTH0_BASE_URL,
    clientID: process.env.AUTH0_CLIENT_ID,
    issuerBaseURL: process.env.AUTH0_ISSUER_BASE_URL
};

// auth router attaches /login, /logout, and /callback routes to the baseURL
app.use(auth(config));


// Configure Express to parse URL-encoded POST request bodies (traditional forms)
app.use( express.urlencoded({ extended: false }) );

// define middleware that logs all incoming requests
app.use(logger("dev"));
app.use(express.static(__dirname + '/public'));


app.use((req, res, next) => {
    res.locals.isLoggedIn = req.oidc.isAuthenticated();
    res.locals.user = req.oidc.user;
    next();
})

app.get('/profile', requiresAuth(), (req, res) => {
    res.send(JSON.stringify(req.oidc.user));
});

// req.isAuthenticated is provided from the auth router
app.get('/authtest', (req, res) => {
    res.send(req.oidc.isAuthenticated() ? 'Logged in' : 'Logged out');
});

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
    WHERE
        userid = ?
`

app.get( "/planner", requiresAuth(), ( req, res) => {
    db.execute(read_planner_all_sql, [req.oidc.user.sub], (error, results) => {
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
    AND
        userid = ?
`

app.get( "/planner/event/:id", requiresAuth(), ( req, res ) => {
    db.execute(read_event_sql, [req.params.id, req.oidc.user.sub], (error, results) => {
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
    AND
        userid = ?
`

app.get("/planner/event/:id/delete", requiresAuth(), ( req, res ) => {
    db.execute(delete_event_sql, [req.params.id, req.oidc.user.sub], (error, results) => {
        if (error)
            res.status(500).send(error);
        else
            res.redirect("/planner");    
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
    AND
        userid = ?
`
app.post("/planner/event/:id", requiresAuth(), ( req, res ) => {
    db.execute(update_event_sql, [req.body.eventName, req.body.description, req.body.time, req.body.location, req.params.id, req.oidc.user.sub], (error, results) => {
        if (error)
            res.status(500).send(error); //Internal Server Error
        else
            res.redirect(`/planner/event/${req.params.id}`);
    });
})


//define a route for the event create
const create_event_sql = `
    INSERT INTO planner
        (eventName, description, userid)
    VALUES
        (?, ?, ?)
`

app.post("/planner", requiresAuth(), ( req, res ) => {
    console.log("Got request")
    db.execute(create_event_sql, [req.body.eventName, req.body.description, req.oidc.user.sub], (error, results) => {
        console.log(error ? error : results);
        if (error)
            res.status(500).send(error); //Internal Server Errorf
        else 
            //results.insertId has the primary key (id) of the newly inserted element.
            res.redirect(`/planner/event/${results.insertId}`);
    });
})

// start the server
app.listen( port, () => {
    console.log(`App server listening on ${ port }. (Go to http://localhost:${ port })` );
} );