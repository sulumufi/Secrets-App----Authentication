//jshint esversion:6

require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const ejs = require("ejs");


//passport module code
const session = require("express-session");
const passport = require("passport");
const passportLocalMongoose = require("passport-local-mongoose");


const mongoose = require("mongoose");

//passport module code
app.use(session({
    secret: 'MylittleSecret',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }
  }))
app.use(passport.initialize())
app.use(passport.session());


url = "mongodb://localhost:27017/userDB";

mongoose.connect(url, {
    useNewUrlParser: true,
    useUnifiedTopology: true
});
mongoose.set('useCreateIndex', true);


app.use(express.static("public"));
app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({
    extended: true
}));


const userSchema = new mongoose.Schema({
    email: String,
    password: String
});


//passport module code
userSchema.plugin(passportLocalMongoose);


const User = new mongoose.model("User", userSchema);


//passport module code with the User model created with a schema using a plugin of passpoert-mongoose-local,
//and the same model is been passed below!.

passport.use(User.createStrategy());
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());



app.get("/", function (req, res) {
    res.render("home");
    
});
app.get("/login", function (req, res) {
    res.render("login");
});
app.get("/register", function (req, res) {
    res.render("register");
});

app.get("/logout",function(req, res){
    req.logOut();
    res.redirect("/");
})


app.get("/secrets", function(req,res){
    if(req.isAuthenticated()){
        res.render("secrets")
    }else{
        res.redirect("/login");
    }
})



app.post("/register", function (req, res) {

    User.register({username: req.body.username}, req.body.password, function(err, user){
        if(err){
            console.log(err);
            res.redirect("/register");
        }
        else{
            passport.authenticate("local")(req, res, function(){
                 res.redirect("/secrets");
            })
        }
    })
})



app.post("/login", function (req, res) {

    const user = new User({
        username : req.body.username,
        password : req.body.password
    });

    req.login(user, function(err){
        if(err){     console.log(err);     }
        else{ passport.authenticate("local")(req, res, function(){res.redirect("/secrets");})}

    });

})



app.listen(3000, function () {
    console.log("Server Up and running!");
});