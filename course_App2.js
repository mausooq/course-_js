// course selling app storing in json file
const express = require('express')
const fs = require('fs')
const jwt = require('jsonwebtoken')
const app = express();

app.use(express.json());
const SECRET ="mausooqSecert";

let ADMINS = [];
let USERS = [];
let COURSES = [];

try {
    ADMINS = JSON.parse(fs.readFileSync('admins.json', 'utf8'));
    USERS = JSON.parse(fs.readFileSync('users.json', 'utf8'));
    COURSES = JSON.parse(fs.readFileSync('courses.json', 'utf8'));
} catch{
    ADMINS = [];
    USERS = [];
    COURSES = [];
}
// console.log(ADMINS);

app.post('/admin/signup',(req,res) =>{
    const {username,password}  = req.body;
    const adminExist = ADMINS.find(x=> x.username=== username);
    if(adminExist){
        res.status.json({message:'admin  already exist'});
    }
    else{
        const newAdmin ={username,password,id:ADMINS.length+1};
        ADMINS.push(newAdmin);
        fs.writeFileSync('admins.json',JSON.stringify(ADMINS));
        const token = jwt.sign({username,role:"admin"},SECRET,{expiresIn: '1h'})
        res.json({message:"admin register successfull ",token})
    }
});
app.post('/admin/login',(req,res)=>{
    const {username, password}= req.headers;
    // console.log(username,password)
    const admin= ADMINS.find(x=> x.username === username && x.password === password );
    if(admin){
        const token = jwt.sign({username, role : "admin" },SECRET ,{ expiresIn: '1h' })
        return res.status(200).send({ message: "welcome back", token});
    }
    else{
        res.status(403).json('INVALID USERNAME OR PASSWORD')
    }
})
app.listen(3000,() =>{
    console.log('server is runnig on port 3000')
})