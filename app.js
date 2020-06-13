var express = require("express");
var app = express();
var bodyParser = require("body-parser");
var mongoose = require("mongoose" );
var passport = require("passport");
var LocalStrategy = require("passport-local");
var Campground = require("./models/campground");
var Comment = require("./models/comment");
var User = require("./models/user");
var seedDB = require("./seeds");

var commentRoutes = require("./routes/comments");
var campgroundROutes = require("./routes/campgrounds");
var indexRoutes = require("./routes/index");

mongoose.connect("mongodb://localhost/yelp_camp",{useNewUrlParser: true, useUnifiedTopology: true  });
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine","ejs"); // so that we don't need to add .ejs everytime we render a page
app.use(express.static(__dirname + "/public"));

//seed the DB
//seedDB();


// PASSPORT Configuration for User authorization
app.use(require("express-session")({
    secret: "Who are you to see my secret key for encryption...",
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req, res, next){
     res.locals.currentUser = req.user;
     next();
});

app.use(indexRoutes);
app.use("/campgrounds", campgroundROutes);
app.use("/campgrounds/:id/comments",commentRoutes);

app.listen("8000",function(){
    console.log("server listening on port 8000 ");
});