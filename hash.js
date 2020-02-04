const bcrypt = require("bcryptjs");

bcrypt.hash("1231234", 12,function(err,hash){
    console.log(hash);
});