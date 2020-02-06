const request = require('request');
let options = {
    url: 'https://euw1.api.riotgames.com/lol/summoner/v4/summoners/by-name/Baxeler?api_key=RGAPI-0c3306b5-d7a1-4018-be75-52cd425cbdfc',
    json: true,
    method: "get"
}

request(options, (err,response, body)=>{
    console.log(body);
    
})