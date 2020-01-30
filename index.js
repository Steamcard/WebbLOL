const express = require("express");
const mongo = require('mongodb').MongoClient;
const cookieParser = require("cookie-parser");
const conString = "mongodb+srv://Kasper:1231234@cluster0-iczm6.mongodb.net/test?retryWrites=true&w=majority"


app = express();
skapaAnslutning()

async function skapaAnslutning()
{
    //Kopplar in oss
    const connect = await mongo.connect(conString,{ useNewUrlParser: true, useUnifiedTopology: true });

    //Skapar en veckosedel
    const db = await connect.db("LOLWebb");

    //Lägger in maträtter i veckosedeln
    const collection = await db.collection("User_data");

    //Kopplar upp oss
    app.use(cookieParser());

    app.use("/Login",express.static(__dirname+"/Login"));

    //Parsa req.body
    app.use(express.urlencoded({extended:false}));

    //Öppnar porten 4000
    app.listen(4000, function(){console.log("Port: 4000")});

    //Lägger en koppling till vår kollektion till vårt app-obejekt
    app.User_data = collection;
    
    //Ladda in vår egen route-module och skicka in app som argument
    require("./router")(app);

    return collection;
}