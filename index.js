const express = require("express");
const mongo = require('mongodb').MongoClient;
const cookieParser = require("cookie-parser");
const conString = "mongodb+srv://Kasper:1231234@cluster0-iczm6.mongodb.net/test?retryWrites=true&w=majority";
const login = require("./Login/login");
const auth = require("./Login/auth");
const app = express();
const path = require('path')
const router = require("./router");

//Detta för Handelbars ska funka
var hbs  = require('express-handlebars');
app.engine('hbs', hbs({ extname: 'hbs', defaultLayout: 'layout', layoutsDir: __dirname + '/views/layouts/' }));
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

//startar serven
startConnection()

//serven startas
async function startConnection()
{
    //Kopplar in oss
    const connect = await mongo.connect(conString,{ useNewUrlParser: true, useUnifiedTopology: true });

    //Skapar Webblol
    const db = await connect.db("webblol");

    //Lägger in userdata i Webblol
    const collection = await db.collection("userdata");

    //Kopplar upp oss
    app.use(cookieParser());

    

    app.use(express.static(__dirname+"/static"));

    //Parsa req.body
    app.use(express.urlencoded({extended:false}));

    //Öppnar porten 4000
    app.listen(4000, function(){console.log("Port: 4000")});

    //Lägger en koppling till vår kollektion till vårt app-obejekt
    app.userdata = collection;
    
    //Ladda in vår egen route-module och skicka in app som argument
    router(app);
    return collection;
}