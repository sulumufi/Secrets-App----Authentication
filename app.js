//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const ejs = require("ejs");

const mongoose = require("mongoose");

url = "mongodb://localhost:27017/userDB";

mongoose.connect(url, {
    useNewUrlParser : true,
    useUnifiedTopology : true
});


app.use(express.static("public"));
app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({
    extended: true
}));


const userSchema = mongoose.Schema({
    email : String,
    password : String
})

const User = new mongoose.model("User", userSchema);




app.get("/",function(req, res){
    res.render("home");
});
app.get("/login",function(req, res){
    res.render("login");
});
app.get("/register",function(req, res){
    res.render("register");
});




app.post("/register", function(req, res){
    console.log(req.body);

    const newUser = User({
        email : req.body.username,
        password : req.body.password
    })

    newUser.save(function(err){
        if(!err){
            res.render("secrets");
        }
        else{
            res.send(err);
        }
    });
})


app.post("/login", function(req, res){
    const username = req.body.username
    const password = req.body.password

    User.findOne({email: username}, function(err, found_user){
        if(err){
            console.log(err)
        }
        else{
            if(found_user.password == password){
                res.render("secrets");
            }
            else{
                res.send("Wrong password");
            }
        }
    })
})





app.listen(3000, function(){
    console.log("Server Up and running!");
})