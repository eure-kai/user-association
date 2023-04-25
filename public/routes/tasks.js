
const express = require('express');
const db = require('../db/db_pool.js');
const fs = require("fs");
const path = require("path");
const DEBUG = true;
const { requiresAuth } = require('express-openid-connect');

let tasksRouter = express.Router();

// define a route for the planner page
const read_tasks_all_sql = fs.readFileSync(path.join(__dirname, "..", "db", "queries", "crud", "read_tasks_all.sql"), {encoding: "UTF-8"});

tasksRouter.get("/", requiresAuth(), ( req, res) => {
    db.execute(read_tasks_all_sql, [req.oidc.user.sub], (error, results) => {
        if (DEBUG)
            console.log(error ? error : results);
        if (error)
            res.status(500).send(error);
        else   
            res.render('tasks', { inventory : results });  
    });
});


//define a route for the event page
const read_task_detail_sql = fs.readFileSync(path.join(__dirname, "..", "db", "queries", "crud", "read_task_detail.sql"), {encoding: "UTF-8"});

tasksRouter.get( "/:id", requiresAuth(), ( req, res ) => {
    db.execute(read_task_detail_sql, [req.params.id, req.oidc.user.sub], (error, results) => {
        if (DEBUG)
            console.log(error ? error : results);
        if (error)
            res.status(500).send(error); //Internal Server Error
        else if (results.length == 0)
            res.status(404).send(`No task found with id = "${req.params.id}"` ); // NOT FOUND
        else {
            let data = results[0];
            //  { id: ___, item: ___ , quantity:___ , description: ____ }
            res.render('detail', data);
        }
    });
});


//define a route for the event delete
const delete_task_sql = fs.readFileSync(path.join(__dirname, "..", "db", "queries", "crud", "delete_task.sql"), {encoding: "UTF-8"});

tasksRouter.get("/:id/delete", requiresAuth(), ( req, res ) => {
    db.execute(delete_task_sql, [req.params.id, req.oidc.user.sub], (error, results) => {
        if (DEBUG)
            console.log(error ? error : results);
        if (error)
            res.status(500).send(error);
        else
            res.redirect("/tasks");    
    });
})


// define a route for event UPDATE
const update_task_sql = fs.readFileSync(path.join(__dirname, "..", "db", "queries", "crud", "update_task.sql"), {encoding: "UTF-8"});

tasksRouter.post("/:id", requiresAuth(), ( req, res ) => {
    db.execute(update_task_sql, [req.body.taskName, req.body.description, req.body.category, req.body.taskDate, req.body.startTime, req.body.endTime, req.body.location, req.params.id, req.oidc.user.sub], (error, results) => {
        if (DEBUG)
            console.log(error ? error : results);
        if (error)
            res.status(500).send(error); //Internal Server Error
        else
            res.redirect(`/planner/event/${req.params.id}`);
    });
})


//define a route for the event create
const create_task_sql = fs.readFileSync(path.join(__dirname, "..", "db", "queries", "crud", "insert_task.sql"), {encoding: "UTF-8"});

tasksRouter.post("/", requiresAuth(), ( req, res ) => {
    db.execute(create_task_sql, [req.body.taskName, req.body.description, req.body.subject, req.oidc.user.sub], (error, results) => {
        if (DEBUG)
            console.log(error ? error : results);
        if (error)
            res.status(500).send(error); //Internal Server Errorf
        else 
            //results.insertId has the primary key (id) of the newly inserted element.
            res.redirect(`/tasks/${results.insertId}`);
    });
})

module.exports = tasksRouter;