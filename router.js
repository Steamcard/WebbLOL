const mongoId = require('mongodb').ObjectID;
const login = require("./Login/login")
const auth = require("./Login/auth")
const request = require('request');
const crypted = require("/Login/password.crypt")

//Hämtar APIKEY Från LOLAPI hemsidan | Måste hämtas ny varje 24 tim!
const apiKey = 'RGAPI-fea142f5-aecd-42e9-a2d8-80ec842ab94c';


module.exports = async function(app){

//home
app.get("/",function(req,res){

        res.render('home',{style:'<link rel="stylesheet" href="/css/home.css"> <link rel="stylesheet" href="/css/header.css">'});

    
});
//funkar ej atm med try catch
try{
//Ger dig stats om din lol gubbe
app.post("/stats",function(req,res)

 {
    let name = JSON.parse(JSON.stringify(req.body)).Summoner;

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
                
                //forEach loop där element.champion hämtar ut alla last id och lägger in i getChampName
                last.forEach(element => 
                    {
                        //Hämtar champion id i arreyen last
                        getChampName(element.champion);

                    //Funktionen hämtar ut Champion namnen med hjälp av id i arryen last
                    function getChampName(id) {

                    //Request metoden går in i en JSON fil med över 144 champions som inehåller mängder med olika data
                    request('http://ddragon.leagueoflegends.com/cdn/10.6.1/data/en_US/champion.json', function (error, response, body) {

                        //Parsar bodyn
                        const list = JSON.parse(body);

                        //hämtar datan till championList
                        const championList = list.data;

                        //For-Loop som går igenom varje Champion
                        for (const i in championList) {
                        //Stämmer 1 av Champion listans id överens med ett av id i last så läggs Champion namnets data från championList till arrayn för att sedan skicka in till stats
                        if (championList[i].key == id) {
                            //kolla hur jag ska logga detta!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
                            const arr = championList[i].id;
                            console.log(arr);
                        }

                        //console.log(championList[i].id + " | " + championList[i].key);
                        }

                    });
                    }
                    });

                    //något sätt att få ut arryen? (arr)
                    //console.log(arr);
                    res.render('stats', {user: user, matches: last, entrieses:entrieses, style:'<link rel="stylesheet" href="/css/stats.css"> <link rel="stylesheet" href="/css/header.css">'});
            });
            
        })
        })
});
}
catch(error){
    app.get("/",function(req,res){

        res.render('home',{style:'<link rel="stylesheet" href="/css/home.css"> <link rel="stylesheet" href="/css/header.css">'});
});
}



    
app.post("/login", login)

app.get("/login", function(req,res){
    res.sendFile(__dirname+"/Login/loginForm.html")
})

//auth verifierar om man är inloggad eller inte | auth är ett middleware (har tillgång till request, respond och next)
app.get("/secret",auth,function(req,res){
    res.send(req.cookies);
});
}

router.get("/register", function(req,res){
    res.sendFile(__dirname + "/registerForm.html");
});

router.post("/register", async function(req,res){

    try{
        let user = await crypted(req.body);
        if(user){
            let insert = await db.dbInserUser(user);
            res.send("You have been registerd");
        } 
        else{
            res.send("ERROR! No user have been created!")
        }
    }
    catch(err)
    {
        res.send(err);
    }
});