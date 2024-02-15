// course selling app storing in mongodb
const express = require('express')
const mongoose = require('mongoose')
const jwt = require('jsonwebtoken')
const app = express();

app.use(express.json());
const secert = 'mausooq';
// define mongoose schema
const userSchema = new mongoose.Schema({
    userName : {typr : String},
    Password : String,
    purchasedCourse :[{type: mongoose.Schema.Types.ObjectId , ref:'course'}]
})

const adminSchema = new mongoose.Schema({
    username:'String',
    password : "String"
})

const courseSchema = new mongoose.Schema({
    title : 'string',
    description : 'string' , 
    price :'number',
    imageLink:'string',
    published:'boolean'
})

// define mongoose model 
const User = mongoose.model('User',userSchema)
const Admin = mongoose.model('Admin',adminSchema)
const Course = mongoose.model('Course',courseSchema)

mongoose.connect('mongodb+srv://abdulmausooq:8080@fuegocluster.c8hjaqp.mongodb.net/');

const authenticateJwt = (req,res,next) => {
    const auth = req.headers.authorization
    if(auth){
        const token = auth.split(" ")[1]
        jwt.veerfiy(token,secert,(err,user)=>{
            if(err) 
                err
            else
                req.user= user
                next();
        })
    }
    else
        return res.status(401).send({msg:"No token provided"});
}
app.post('/admin/signup',async (req,res) => {
    const {username,password} = req.body;
    const admin = await Admin.findOne({username})
    if(admin){
        res.status(403).json({meassage:"admin already exist"})
    }
    else{ 
    const obj = {username: username ,password: password};
    const newAdmin = new Admin(obj);
    await newAdmin.save();
    const token = jwt.sign({username,role:'admin'},secert,{expiresIn:'1h'})
    res.json({message:"new admin added",token})
}
})

app.post('/admin/login', async (req,res) =>{
    const {username,password} = req.headers;
    const adminExist = await Admin.findOne(username,password);
    if(adminExist){
        const token = jwt.sign({username,role:"admin"},secert,{expiresIn : '1h'})
        res.json({message:"login successfully",token})
    }
    else{
        res.statuss(403).json({message:"Invalid username or password"});
    }
})

app.post('/admin/course',authenticateJwt, async (req,res) =>{
    const course = new Course(req.body)
    await Course.save();
    res.json(course)
}) 
app.listen(3000, (username) => console.log("Server is running on port 3000"));