const express = require('express');

const app =express();

app.use(express.json());

let admins = [];
let users = [];
let courses = [];

app.get('/admin/signup',(req, res) =>{
    console.log("admin")
})
app.post('/admin/signup',(req, res) =>{
    console.log("admin")
})

app.listen(3000, ()=> console.log("Server is running on port 3000"));