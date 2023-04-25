const express = require('express');
const db = require('../db/db_pool.js');
const fs = require("fs");
const path = require("path");
const DEBUG = true;
const { requiresAuth } = require('express-openid-connect');

let categoriesRouter = express.Router();

module.exports = categoriesRouter;