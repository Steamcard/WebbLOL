const request = require('request');
let options = {
    url: 'https://euw1.api.riotgames.com/lol/summoner/v4/summoners/by-name/16FPS?api_key=RGAPI-49f17f4e-435a-448d-8fe7-00e7f80975c1',
    json: true,
    method: "get"
}

request(options, (err,response, body)=>{
    console.log(body);
    
})

let top = {
    url: 'https://euw1.api.riotgames.com/lol/match/v4/matchlists/by-account/KIVgOiuLCgFCh85bIDODTztdP28dawk5CDOQEU4NlFQiIXk?api_key=RGAPI-49f17f4e-435a-448d-8fe7-00e7f80975c1',
    json: true,
    method: "get"
}

request(top, (err,response, body)=>{
    console.log(body);
    
})