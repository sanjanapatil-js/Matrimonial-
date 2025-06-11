var express    = require("express"),
    app        = express(),
    bodyParser = require("body-parser"),
    mongoose   = require("mongoose"),
    flash      = require("connect-flash"),
    passport   = require("passport"),
    LocalStrategy = require("passport-local"),
    methodOverride = require("method-override"),
    Bachelor   = require("./models/bachelor"),
    Comment    = require("./models/comment"),
    User       = require("./models/user"),
    seedDB     = require("./seeds");
 

var commentRoutes  = require("./routes/comments"),
    bachelorRoutes = require("./routes/bachelors"),
    indexRoutes    = require("./routes/index");

    

mongoose.connect("mongodb://localhost/matri_monial", {useNewUrlParser: true});
mongoose.connection
    .once("open", () => console.log("Connected"))  
    .on("eror", error => {                          
        console.log("Your Error: ",error);
    });

app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine","ejs");
app.use(express.static(__dirname+"/public"));
app.use(methodOverride("_method"));
app.use(flash());


app.use(require("express-session")({
    secret: "I will make you proud oneday. ",
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
    res.locals.error     = req.flash("error");
    res.locals.success   = req.flash("success");
    next();
});

app.use(indexRoutes);
app.use("/bachelors", bachelorRoutes);
app.use("/bachelors/:id/comments", commentRoutes);



app.listen(4000,function(){
    console.log("Matrimonial Server has started");
});
