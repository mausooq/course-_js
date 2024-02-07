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
    ADMINS = JSON.parse(fs.readFileSync('admins.json', 'utf8'))
    // USERS = JSON.parse(fs.readFileSync('users.json', 'utf8'))
    COURSES = JSON.parse(fs.readFileSync('courses.json', 'utf8'))

} catch{
    ADMINS = [];
//     USERS = [];
    COURSES = [];
}
// console.log(USERS);
// console.log(ADMINS);
const authorizationJwt = (req,res,next) =>{
    const auth = req.headers.authorization;
    if(auth){
        const token = auth.split(' ')[1];
        jwt.verify(token,SECRET,(err,user) =>{
            if(err){
                res.status(403).json()
            }
            req.user =user;
            next();
        })

    }
    else{
        res.status(401).json({message:'Authorization failed'});
    }
}

app.post('/admin/signup',(req,res) =>{
    const {username,password}  = req.body;
    const adminExist = ADMINS.find(x=> x.username=== username);
    if(adminExist){
        res.status(403).json({message:'admin  already exist'});
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
    const admin = ADMINS.find(x=> x.username === username && x.password === password );
    if(admin){
        const token = jwt.sign({username, role : "admin" },SECRET ,{ expiresIn: '1h' })
        return res.status(200).send({ message: "welcome back", token});
    }
    else{
        res.status(403).json('INVALID USERNAME OR PASSWORD')
    }
})
app.post('/admin/courses',authorizationJwt,(req,res)=>{
    const course = req.body;
    console.log(course)
    course.id = Date.now();
    COURSES.push(course);
    fs.writeFileSync('courses.json',JSON.stringify(COURSES));
    res.json({message:'new course is added',id:course.id});
})
app.put('/admin/courses/:id',authorizationJwt,(req,res) =>{
    const id = parseInt(req.params.id)
    const course = COURSES.find(x => x.id === id)

    if(course){
        Object.assign(course,req.body)
        fs.writeFileSync("courses.json", JSON.stringify(COURSES));
        res.json({message:'course updated'})
    }
    else{
        res.status(404).json({message:"this course does not exist"})
    }
})
app.get('/admin/courses',authorizationJwt,(req,res) =>{
    res.json({course:COURSES})
})
app.listen(3000,() =>{
    console.log('server is runnig on port 3000')
})