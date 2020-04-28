const mongoId = require('mongodb').ObjectID;
const login = require("./Login/login")
const auth = require("./Login/auth")
const request = require('request');
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

//Hämtar APIKEY Från LOLAPI hemsidan | Måste hämtas ny varje 24 tim!
const apiKey = 'RGAPI-6cb90139-0af2-49bf-ba86-690545a99608';


module.exports = async function(app){

//home
    app.get("/",function(req,res){

            res.render('home',{style:'<link rel="stylesheet" href="/css/home.css"> <link rel="stylesheet" href="/css/header.css">'});

    });

    app.post("/login",login,function(req,res)
    {
        res.redirect("/secret");
    });


    app.get("/login",function(req,res){
        res.render('login');
    });

    app.get("/secret",auth,function(req,res){
        res.send(req.cookies);
    });
    
    app.get("/logout", function(req,res){
        res.cookie("token", "Du har loggat ut!");
        res.redirect("/secret");
    });


//Ger dig stats om din lol gubbe
    app.post("/stats",auth,function(req,res){

        let name = req.body.Summoner;
        console.log(name);

        let SummonerInfo = {
            url: `https://euw1.api.riotgames.com/lol/summoner/v4/summoners/by-name/${name}?api_key=${apiKey}`,
            json: true,
            method: "get"
        }

        
        request(SummonerInfo, (error,response, user)=>{

            let Match = {
                url: `https://euw1.api.riotgames.com/lol/match/v4/matchlists/by-account/${user.accountId}?api_key=${apiKey}`,
                json: true,
                method: "get"
            }

                
                request(Match, (serr,ses, macther)=>{

                    let entries = {
                        url: `https://euw1.api.riotgames.com/lol/league/v4/entries/by-summoner/${user.id}?api_key=${apiKey}`,
                        json: true,
                        method: "get"
                    }


                        request(entries, async (error3,response3, entrieses)=>{

                            let list = await getChampion();
                            
                            list = list.data;



                    //Tar de sisa arrayen på macthes så inte alla loggar (över 100st)
                    last = macther.matches.slice(0,4);


                    last.map(element=>{

                        for(let i in list){
                            if(list[i].key == element.champion){

                                element.name = list[i].id;
                            }

                        }
                    });
                    
                    console.log(last);
                    
                    res.render('stats', {user: user, matches: last, entrieses:entrieses,style:'<link rel="stylesheet" href="/css/stats.css"> <link rel="stylesheet" href="/css/header.css">'});
                })})})
    });

function getChampion(){
    let p = new Promise ((resolve, reject)=>{
        request('http://ddragon.leagueoflegends.com/cdn/10.6.1/data/en_US/champion.json', function (error, response, body) {

            if(error) resolve({mes:"errror"});
            else resolve(JSON.parse(body));
        }

    )});
    return p;
}
};