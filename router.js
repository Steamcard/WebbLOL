const mongoId = require('mongodb').ObjectID;
const login = require("./Login/login")
const auth = require("./Login/auth")

module.exports = async function(app){

app.get("/",function(req,res){
    res.send(home.html);
});
    
app.post("/login", login)

app.get("/login", function(req,res){
    res.sendFile(__dirname+"/Login/loginForm.html")
})

//auth verifierar om man är inloggad eller inte | auth är ett middleware (har tillgång till request, respond och next)
app.get("/secret",auth,function(req,res){
    res.send(req.cookies);
});
}