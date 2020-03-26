const bcrypt = require("bcryptjs");
module.exports = async function (body){

    try{
        let user = {...body};
        let salt = await bcrypt.genSalt(14);

        user.password = await bcrypt.hash(user.password, salt);
        return user;
    }
    catch{
        return false;
    }
}