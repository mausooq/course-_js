const express = require('express');

const app =express();

app.use(express.json());

let admins = [];
let users = [];
let courses = [];

app.post('/admin/signup',(req, res) =>{
    const admin =req.body
})


