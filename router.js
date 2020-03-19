const mongoId = require('mongodb').ObjectID;
const login = require("./Login/login")
const auth = require("./Login/auth")
const request = require('request');

//Hämtar APIKEY Från LOLAPI hemsidan | Måste hämtas ny varje 24 tim!
const apiKey = 'RGAPI-8d2b5651-0c47-431b-8874-da6c7112968b';


module.exports = async function(app){

app.get("/",function(req,res){
        res.render('home');
    
});

//Ger dig stats om din lol gubbe
app.post("/stats",function(req,res)
{
    let name = JSON.parse(JSON.stringify(req.body)).Summoner;
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


                    request(entries, (error3,response3, entrieses)=>{

                //Tar de sisa arrayen på macthes så inte alla loggar (över 100st)
                last = macther.matches.slice(0,4);
                
                
                res.render('stats', {user: user, matches: last, entrieses:entrieses});
            });
            
        })
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