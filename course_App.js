// course app using memory as db 
const express = require('express');
const app =express();

app.use(express.json());

let COURSES = [];
let ADMINS =[];
let USERS = [];

const adminAuth =(req,res,next) => {
    const {username,password} = req.headers;
    const adminVerfiy = ADMINS.find(a => a.username === username && a.password === password);
    if(adminVerfiy){
        next();
    }
    else{
        res.status(404).json({message:"Admin authentication failed"});
    }
}
app.post('/admin/signup',(req,res) =>{
    const admin= req.body;
    const adminExist = ADMINS.find(a => a.username === admin.username);
    if(adminExist){
        res.status(403).json({message:"admin alerdy exist"})    
    }
    else{
        ADMINS.push(admin);
        res.json({message:"signup sucessfull"})
    }
})

app.post('/admin/login',adminAuth,(req,res) =>{
    res.json({message:"admin login successfully"})
})

app.post('/admin/courses',adminAuth,(req,res)=>{
    const course = req.body;
    course.id = Date.now();
    COURSES.push(course);
    res.json({message:"course is added successfully"})
})
app.put('/admin/courses/:coursesId',adminAuth,(req,res)=>{
    const coursesId = parseInt(req.params.coursesId);
    const course = COURSES.find(c=> c.id === coursesId)
    if(course){
        Object.assign(course,req.body);
        res.json({message : "course updated succcessfully"})
    }
    else{
        res.json({message:"course is not found"})
    }
})
app.get('/admin/courses',adminAuth,(req,res)=>{
    res.json({courses:COURSES})
})
app.listen(3000,() =>{
    console.log("server running at port 3000")
})