var express = require("express");
var app = express();

app.set("view engine","ejs"); // so that we don't need to add .ejs everytime we render a page

// root route which will be homepage
app.get("/",function(req,res){
    res.render("landing");
});

//campgrounds route
app.get("/campgrounds",function(req,res){
    var campgrounds = [
        {
            name : "Hampta Pass Trek",
            image : "https://pixabay.com/get/52e8d4444255ae14f6da8c7dda793f7f1636dfe2564c704c7d2b7ed6974bc650_340.jpg"
        },
        {
            name : "Hampta Pass Trek",
            image : "https://pixabay.com/get/52e8d4444255ae14f6da8c7dda793f7f1636dfe2564c704c7d2b7ed6974bc650_340.jpg"
        },
        {
            name : "Hampta Pass Trek",
            image : "https://pixabay.com/get/52e8d4444255ae14f6da8c7dda793f7f1636dfe2564c704c7d2b7ed6974bc650_340.jpg"
        }
    ];
    res.render("campgrounds",{campgrounds : campgrounds});
});

app.listen("3000",function(){
    console.log("server listening on port 3000 ");
});