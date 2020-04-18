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

mongoose.connect("mongodb://localhost/yelp_camp",{useNewUrlParser: true, useUnifiedTopology: true  });
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine","ejs"); // so that we don't need to add .ejs everytime we render a page
app.use(express.static(__dirname + "/public"));
//seed the DB
seedDB();

// root route which will be homepage
app.get("/",function(req,res){
    res.render("landing");
});

//campgrounds route
app.get("/campgrounds",function(req,res){
    //Get all campgrounds from Db
    Campground.find({},function(err,campgrounds){
        if(err){
            console.log(err);
        } else {
            res.render("campgrounds/index",{campgrounds : campgrounds});
        }
    });
});

app.post("/campgrounds",function(req,res){
    // get data from form and add to campgrounds array
    var name = req.body.name;
    var image = req.body.image;
    var description = req.body.description;
    var newCampground = {name: name,image: image,description:description};
    //campgrounds.push(newCampground);
    // Add newCampGround to Database
    Campground.create(newCampground,function(err,campground){
        if(err){
            console.log(err);
        } else{
            // redirect back to campgrounds page
            res.redirect("/campgrounds");
        }
    });
});

app.get("/campgrounds/new",function(req,res){
    res.render("campgrounds/new");
});

//Shows more info about one campground
app.get("/campgrounds/:id",function(req, res){
    // find the campground with that id 
    Campground.findById(req.params.id).populate("comments").exec(function(err,campground){
        if(err){
            console.log(err);
        } else{
            //render show template with that campground
            res.render("campgrounds/show",{campground: campground});
        }
    });
});

// ==================================
// COMMENT ROUTES
// ==================================

app.get("/campgrounds/:id/comments/new", function(req,res){
    Campground.findById(req.params.id, function(err, campground){
        if(err){
            console.log(err);
        } else{
            res.render("comments/new", {campground: campground});
        }
    });
});

app.post("/campgrounds/:id/comments", function(req,res){
    // find campground by id
    Campground.findById(req.params.id, function(err,campground){
        if(err){
            console.log(err);
            res.redirect("/campgrounds");
        } else {
            // create new comment
            Comment.create(req.body.comment, function(err, comment){
                if(err){
                    console.log(err);
                } else{
                    // link comment to campground
                    campground.comments.push(comment);
                    campground.save();
                    // redirect to campground page
                    res.redirect("/campgrounds/" + campground._id);
                }
            });
        }
    });
});

// =====================
// AUTH ROUTES

// show register form
app.get("/register",function(req,res){
    res.render("register");
});
// handle sign up logic
app.post("/register",function(req,res){
    var newUser = new User({username: req.body.username});
    User.register(newUser, req.body.password, function(err, user){
        if(err){
            console.log(err);
            return res.render("register");
        }
        passport.authenticate("local")(req, res, function(){
            res.redirect("/campgrounds");
        });
    });
});
// show login form
app.get("/login",function(req,res){
    res.render("login");
});
// login logic
app.post("/login", passport.authenticate("local",
    {
        successRedirect: "/campgrounds",
        failureRedirect: "/login"
    }), function(req,res){
    
});

// =====================

app.listen("8000",function(){
    console.log("server listening on port 8000 ");
});