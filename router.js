const mongoId = require('mongodb').ObjectID;
const login = require("./Login/login")
const auth = require("./Login/auth")
const request = require('request');
const apiKey = 'RGAPI-b233b4b8-ab72-41ad-89d5-ef5d681cfb11';


module.exports = async function(app){

app.get("/",function(req,res){
        res.render('home');
    
});

app.get("/stats",function(req,res)
{
    let options = {
        url: 'https://euw1.api.riotgames.com/lol/summoner/v4/summoners/by-name/16FPS?api_key=RGAPI-b233b4b8-ab72-41ad-89d5-ef5d681cfb11',
        json: true,
        method: "get"
    }

    let top = {
        url: 'https://euw1.api.riotgames.com/lol/match/v4/matchlists/by-account/KIVgOiuLCgFCh85bIDODTztdP28dawk5CDOQEU4NlFQiIXk?api_key=RGAPI-b233b4b8-ab72-41ad-89d5-ef5d681cfb11',
        json: true,
        method: "get"
    }
    
    request(top, (err,res, matches)=>{
        request(options, (error,response, user)=>{
            //res.render('stats', {body:body,hejsan:hejsan});
            console.log(user);
            //console.log(body);
            res.render('stats', user);
        });
        
    })
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