const mongoId = require('mongodb').ObjectID;
const login = require("./Login/login")

module.exports = async function(app){
    
app.post("/login", function(req,res)
{
    res.sendFile(__dirname+"/Login/loginForm.html");
})

app.get("login", function(req,res){
    res.sendFile(__dirname+"/Login/loginForm.html")
})



}