const request = require('request');
const apiKey = 'RGAPI-3a60eb5a-bbbb-405b-a216-64d822241b75';

let top = {
    url: 'https://euw1.api.riotgames.com/lol/champion-mastery/v4/champion-masteries/by-summoner/RGAPI-8d2b5651-0c47-431b-8874-da6c7112968b',
    json: true,
    method: "get"
}

request(top, (err,response, body)=>{
    console.log(body);
    
})