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
const userAuth =(req,res,next) => {
    const {username,password} = req.headers;
    const user = USERS.find(u => u.username === username && u.password === password);
    if(user){
        req.user=user;
        next();
    }
    else{
        res.status(404).json({message:"User authentication failed"});
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

app.post('/users/signup',(req,res) =>{
    const user = {...req.body,purchasedCourses:[]};
    const userExist = USERS.find(u => u.username === user.username);
    if(userExist){
        res.status(403).json({message:"user alerdy exist"})    
    }
    else{
        USERS.push(user);
        res.json({message:"signup sucessfull"})
    }
})
app.post('/users/login',userAuth,(req,res) =>{
    res.json({message:"user login successfully"})
})
app.get('/users/courses',userAuth,(req,res) =>{
     const filteredCourse = COURSES.find(c => c.published);
     res.json(filteredCourse);
})
app.post('/users/courses/:courseId',userAuth, (req,res)=>{
    const courseId = parseInt(req.params.courseId);
    const course = COURSEs.find(c=>c.id === courseId && c.published );
    if(course){
        req.user.purchasedCourses.push(courseId);
        res.json({message:"course is buyed successfully"}) 
    }
    else 
    {
        res.status(404).jsom({message:'copurse is not found or not published'})
    }
})
app.get('/users/purchasedCourses',userAuth,(req,res) =>{
    const purchasedCourses = COURSES.filter(c => req.user.purchasedCourses.include(c.id));
    res.json({message:purchasedCourses});
});
app.listen(3000,() =>{
    console.log("server running at port 3000")
})