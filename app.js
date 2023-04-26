const DEBUG = true;

//set up the server
const db = require('./db/db_pool.js');
const express = require( "express" );
const app = express();
const port = process.env.PORT || 8080;
const logger = require("morgan");
const { auth } = require('express-openid-connect');
const { requiresAuth } = require('express-openid-connect');
const dotenv = require('dotenv');
dotenv.config();
const path = require("path");

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


//Configure Express to use EJS
app.set( "views",  path.join(__dirname, "views"));
app.set( "view engine", "ejs" );

// Configure Express to parse URL-encoded POST request bodies (traditional forms)
app.use(express.urlencoded({ extended: false }) );

// define middleware that logs all incoming requests
app.use(logger("dev"));

// define middleware that serves static resources in the public directory
app.use(express.static(path.join(__dirname, 'public')));


//Configure auth
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

// define middleware that appends useful auth-related information to the res object
// so EJS can easily access it
app.use((req, res, next) => {
    res.locals.isLoggedIn = req.oidc.isAuthenticated();
    res.locals.user = req.oidc.user;
    next();
})

// req.isAuthenticated is provided from the auth router
app.get('/authtest', (req, res) => {
    res.send(req.oidc.isAuthenticated() ? 'Logged in' : 'Logged out');
});

app.get('/profile', requiresAuth(), (req, res) => {
    res.send(JSON.stringify(req.oidc.user));
});

// define a route for the default home page
app.get( "/", ( req, res ) => {
    res.render('index');
});

let tasksRouter = require("./routes/tasks.js");
app.use("/tasks", requiresAuth(), tasksRouter);

let categoriesRouter = require("./routes/categories.js");
app.use("/categories", requiresAuth(), categoriesRouter);

// start the server
app.listen( port, () => {
    console.log(`App server listening on ${ port }. (Go to http://localhost:${ port })` );
} );