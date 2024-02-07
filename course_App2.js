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
    USERS = JSON.parse(fs.readFileSync('users.json', 'utf8'))
    COURSES = JSON.parse(fs.readFileSync('courses.json', 'utf8'))

} catch{
    ADMINS = [];
    USERS = [];
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
app.post('/users/signup',(req,res) =>{
    const {username,password}  = req.body;
    const userExist = USERS.find(x=> x.username === username);
    if(userExist){
        res.status(403).json({message:'user  already exist'});
    }
    else{
        const newUser ={username,password,id:USERS .length+1};
        USERS.push(newUser);
        fs.writeFileSync('users.json',JSON.stringify(USERS));
        const token = jwt.sign({username,role:"user"},SECRET,{expiresIn: '1h'})
        res.json({message:"user register successfull ",token})
    }
});
app.post('/users/login',(req,res)=>{
    const {username, password}= req.headers;
    // console.log(username,password)
    const user = USERS.find(x=> x.username === username && x.password === password );
    if(user){
        const token = jwt.sign({username, role : "user" },SECRET ,{ expiresIn: '1h' })
        return res.status(200).send({ message: "welcome back", token});
    }
    else{
        res.status(403).json('INVALID USERNAME OR PASSWORD')
    }
})
app.get('/users/courses',authorizationJwt,(req,res) =>{
    res.json({course:COURSES})
})
app.post('/users/courses/:courseId',authorizationJwt, (req,res)=>{
   const courseId = parseInt(req.params.courseId)
    const course = COURSES.find(c => c.id === courseId);
    if(course){
        const user =USERS.find(x => x.username === req.user.username)
        if(user){
            if(!user.purchasedCourse){
                user.purchasedCourse =[];
            }
            user.purchasedCourse.push(course);
            fs.writeFileSync('users.json', JSON.stringify(USERS))
            res.json({ message: 'Course purchased successfully' });
        }
        else{
            res.json({message:'user is not found'})
        }
    }
    else{
        res.json({message:'course is not found'})
    }
})
app.get('/users/purchasedCourses',authorizationJwt,(req,res) =>{
    const user =  USERS.find(u => u.username===req.user.username)
    if(user){
        res.json({purchasedCourse:user.purchasedCourse})
    }
    else{
        res.json({message: 'User Not Found'})
    }
})
app.listen(3000,() =>{
    console.log('server is runnig on port 3000')
})