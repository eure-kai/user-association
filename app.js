
const db = require('./db/db_pool.js');
const DEBUG = true;

//for simplification/queries
const path = require("path");
const fs = require("fs");

//set up the server
const express = require( "express" );
const app = express();
const port = process.env.PORT || 8080;


//Configure Express to use EJS
app.set( "views",  path.join(__dirname, "views"));
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
app.use(express.static(path.join(__dirname, 'public')));


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

let tasksRouter = require("./routes/tasks.js");
app.use("/tasks", tasksRouter);

let categoriesRouter = require("./routes/categories.js");
app.use("/categories", categoriesRouter);

// start the server
app.listen( port, () => {
    console.log(`App server listening on ${ port }. (Go to http://localhost:${ port })` );
} );