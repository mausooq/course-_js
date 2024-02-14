// course selling app storing in mongodb
const express = require('express')
const mongoose = require('mongoose')
const jwt = require('jsonwebtoken')
const app = express();

app.use(express.json());

// define mongoose schema
const userName = new mongoose.Schema({
    userName : {typr : String},
    Password : String,
    purchasedCourse :["gata"]
})

app.listen(3000, () => console.log("Server is running on port 3000"));