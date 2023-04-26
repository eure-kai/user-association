const DEBUG = true;
const express = require('express');
const db = require('../../db/db_pool.js');
const fs = require("fs");
const path = require("path");

let tasksRouter = express.Router();


// define a route for the planner page
const read_categories_all_sql = fs.readFileSync(path.join(__dirname, "..", "..", "db", "queries", "crud", "read_categories_all.sql"), {encoding: "UTF-8"});
const read_tasks_all_sql = fs.readFileSync(path.join(__dirname, "..", "..", "db", "queries", "crud", "read_tasks_all.sql"), {encoding: "UTF-8"});

tasksRouter.get("/", ( req, res) => {
    db.execute(read_tasks_all_sql, [req.oidc.user.sub], (error, results) => {
        if (DEBUG)
            console.log(error ? error : results);
        if (error)
            res.status(500).send(error); //Internal Server Error
        else {
            //make second follow up query before responding
            db.execute(read_categories_all_sql, [req.oidc.user.sub], (error2, results2) => {
                if (DEBUG)
                    console.log(error2 ? error2 : results2);
                if (error2)
                    res.status(500).send(error2);
                else {
                    let data = {inventory: results, categorylist: results2};
                    res.render('tasks', data);
                }
            });
        } 
    });
});


//define a route for the task detail page
const read_task_detail_sql = fs.readFileSync(path.join(__dirname, "..", "..", "db", "queries", "crud", "read_task_detail.sql"), {encoding: "UTF-8"});

tasksRouter.get( "/:id", ( req, res ) => {
    db.execute(read_task_detail_sql, [req.params.id, req.oidc.user.sub], (error, results) => {
        if (DEBUG)
            console.log(error ? error : results);
        if (error)
            res.status(500).send(error); //Internal Server Error
        else if (results.length == 0)
            res.status(404).send(`No task found with id = "${req.params.id}"` ); // NOT FOUND
        else {
            //make second follow up query before responding
            db.execute(read_categories_all_sql, [req.oidc.user.sub], (error2, results2) => {
                if (DEBUG)
                    console.log(error2 ? error2 : results2);
                if (error2)
                    res.status(500).send(error2);
                else {
                    let data = {inventory: results[0], categorylist: results2};
                    res.render('detail', data);
                }
            });
        }
    });
});

//define a route for the task CREATE
const create_task_sql = fs.readFileSync(path.join(__dirname, "..", "..", "db", "queries", "crud", "insert_task.sql"), {encoding: "UTF-8"});

tasksRouter.post("/", ( req, res ) => {
    db.execute(create_task_sql, [req.body.taskName, req.body.description, req.body.category, req.body.taskDate, req.body.startTime, req.body.endTime, req.body.location, req.oidc.user.sub], (error, results) => {
        if (DEBUG)
            console.log(error ? error : results);
        if (error)
            res.status(500).send(error); //Internal Server Error
        else 
            //results.insertId has the primary key (id) of the newly inserted element.
            res.redirect(`/tasks/${results.insertId}`);
    });
});

// define a route for task UPDATE
const update_task_sql = fs.readFileSync(path.join(__dirname, "..", "..", "db", "queries", "crud", "update_task.sql"), {encoding: "UTF-8"});

tasksRouter.post("/:id", ( req, res ) => {
    db.execute(update_task_sql, [req.body.taskName, req.body.description, req.body.category, req.body.taskDate, req.body.startTime, req.body.endTime, req.body.location, req.params.id, req.oidc.user.sub], (error, results) => {
        if (DEBUG)
            console.log(error ? error : results);
        if (error)
            res.status(500).send(error); //Internal Server Error
        else
            res.redirect(`/tasks/${req.params.id}`);
    });
})

//define a route for the task delete
const delete_task_sql = fs.readFileSync(path.join(__dirname, "..", "..", "db", "queries", "crud", "delete_task.sql"), {encoding: "UTF-8"});

tasksRouter.get("/:id/delete", ( req, res ) => {
    db.execute(delete_task_sql, [req.params.id, req.oidc.user.sub], (error, results) => {
        if (DEBUG)
            console.log(error ? error : results);
        if (error)
            res.status(500).send(error); //Internal Server Error
        else
            res.redirect("/tasks");    
    });
});

module.exports = tasksRouter;