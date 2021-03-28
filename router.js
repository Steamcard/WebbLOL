const mongoId = require('mongodb').ObjectID;
const login = require("./Login/login")
const auth = require("./Login/auth")
const request = require('request');
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

//Hämtar APIKEY Från LOLAPI hemsidan | Måste hämtas ny varje 24 tim!
const apiKey = 'RGAPI-2fc01990-2ebd-4626-af04-b9de7e370cf8';


module.exports = async function(app){

//Start sidan
    app.get("/",function(req,res){

            res.render('home',{style:'<link rel="stylesheet" href="/css/home.css"> <link rel="stylesheet" href="/css/header.css">'});

    });

    function passUserData(req,res,next){
        req.userdata = app.userdata;
        next();
    };

    app.post("/login",passUserData,login,function(req,res)
    {
        res.redirect("/secret");
    });

    app.post("/register", async function(req,res){

        let user = await app.userdata.findOne({email:req.body.email}); //letar om det redans finns en samma mail
        if(user) //om mailen hittades
        {
            return res.send("user finns");
        }
        let newUser = {...req.body}; //annars så skapas en newUser
        newUser.password = await bcrypt.hash(newUser.password, 12); //krypterar lössenordet

        await app.userdata.insertOne(newUser); //lägger in newUser i userdata
        res.redirect("/login") //skickas till login för att sedan logga in näär kontot är skapat
    })
    app.get("/register",function (req,res){
        res.sendFile(__dirname + "/Login/registerForm.html");
    })

//Inloggning
    app.get("/login",function(req,res){
        res.render('login');
    });



//Stats hemisdan
    app.post("/stats",auth,function(req,res){

        //Sparar inputen (namnet) man ger på startsidan 
        let name = req.body.Summoner; //hämtar namnet från home

        //Hämtar ut information från Riot Games genom API och spelarens namn
        let SummonerInfo = {
            url: `https://euw1.api.riotgames.com/lol/summoner/v4/summoners/by-name/${name}?api_key=${apiKey}`,
            json: true,
            method: "get"
        }

        
        request(SummonerInfo, (error,response, user)=>{
            //Hämtar ut information från Riot Games genom API och spelarens namn
            let Match = {
                url: `https://euw1.api.riotgames.com/lol/match/v4/matchlists/by-account/${user.accountId}?api_key=${apiKey}`,
                json: true,
                method: "get"
            }

                
                request(Match, (serr,ses, macther)=>{
                    //Hämtar ut information från Riot Games genom API och spelarens namn
                    let entries = {
                        url: `https://euw1.api.riotgames.com/lol/league/v4/entries/by-summoner/${user.id}?api_key=${apiKey}`,
                        json: true,
                        method: "get"
                    }


                        request(entries, async (error3,response3, entrieses)=>{
                            //Hämtar ut information från Riot Games genom API och spelarens namn
                            let list = await getChampion(); //säter textdokumentet med all information i en list
                            
                            list = list.data;



                    //Tar de sitsa arrayen på macthes så inte alla loggar (över 100st)
                    last = macther.matches.slice(0,4);

                    //Mappar de matcherna som är över
                    last.map(element=>{

                        for(let i in list){
                            //Kollar key id i txt filen och jä,för mellan id för de spelarna har spelat.
                            if(list[i].key == element.champion){
                                //sätter in namnet i listan
                                element.name = list[i].id;
                            }

                        }
                    });
                    
                    console.log(last);
                    //Renderar allt jag behöver i stats
                    res.render('stats', {user: user, matches: last, entrieses:entrieses,style:'<link rel="stylesheet" href="/css/stats.css"> <link rel="stylesheet" href="/css/header.css">'});
                })})})
    });

function getChampion(){
    let p = new Promise ((resolve, reject)=>{
        //hämtar text filen från Riot Games
        request('http://ddragon.leagueoflegends.com/cdn/10.6.1/data/en_US/champion.json', function (error, response, body) {

            if(error) resolve({mes:"error"});
            else resolve(JSON.parse(body));
        }

    )});
    return p;
}
};