const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');

//mongodb store
const MongoStore = require('connect-mongo');

// database connection
const  dbUrl = 'mongodb://127.0.0.1:27017/tutorial_db';
mongoose.set("strictQuery", false);
mongoose.connect(dbUrl, () => {
  console.log("Connected to MongoDB");
});
const dbOptions = {
    useNewUrlParser: true,
    useUnifiedTopology: true
};
//created an express application
let app = express();

//let server know to parse json and urlencoded request data
app.use(express.json());
app.use(express.urlencoded({extended: true}));

//use session
app.use(session({
    secret: 'my-secret',
    resave: false,
    saveUninitialized: true,
    store: MongoStore.create({mongoUrl: dbUrl}),
    cookie:{
        maxAge: 1000 * 60 * 60 * 24 //Max Age of cookie is one day
    }
}))

//single route for test
app.get('/',(req,res,next)=>{
    
    if(req.session.visitTimes){
        req.session.visitTimes = req.session.visitTimes + 1;
    }else{
        req.session.visitTimes = 1;
    }
    res.send(`<h1>You have visited this route ${req.session.visitTimes} times</h1>`)
})


//start the server to listen to port
const PORT = process.env.PORT || 3000;
app.listen(PORT, ()=>{
    console.log(`Server running on ${PORT}`);
})
