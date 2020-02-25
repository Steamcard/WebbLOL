const request = require('request');
const apiKey = 'RGAPI-3a60eb5a-bbbb-405b-a216-64d822241b75';
let options = {
    url: 'https://euw1.api.riotgames.com/lol/summoner/v4/summoners/by-name/16FPS?api_key=RGAPI-3a60eb5a-bbbb-405b-a216-64d822241b75',
    json: true,
    method: "get"
}

request(options, (err,response, body)=>{
    console.log(body.name);
    
})

let top = {
    url: 'https://euw1.api.riotgames.com/lol/match/v4/matchlists/by-account/KIVgOiuLCgFCh85bIDODTztdP28dawk5CDOQEU4NlFQiIXk?api_key=RGAPI-3a60eb5a-bbbb-405b-a216-64d822241b75',
    json: true,
    method: "get"
}

request(top, (err,response, body)=>{
    console.log();
    
})