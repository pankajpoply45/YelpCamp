var express = require("express");
var router = express.Router();
var Campground = require("../models/campground");

//campgrounds route
router.get("/",function(req,res){
    //Get all campgrounds from Db
    Campground.find({},function(err,campgrounds){
        if(err){
            console.log(err);
        } else {
            res.render("campgrounds/index",{campgrounds : campgrounds});
        }
    });
});

router.post("/", isLoggedIn, function(req,res){
    // get data from form and add to campgrounds array
    var name = req.body.name;
    var image = req.body.image;
    var description = req.body.description;
    var author = {
        username: req.user.username,
        id : req.user._id
    };
    var newCampground = {name: name,image: image,description:description,author: author};
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

router.get("/new", isLoggedIn, function(req,res){
    res.render("campgrounds/new");
});

//Shows more info about one campground
router.get("/:id",function(req, res){
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

function isLoggedIn(req,res,next){
    if(req.isAuthenticated())
    {
        return next();
    }
    return res.redirect("/login");
}

module.exports = router;