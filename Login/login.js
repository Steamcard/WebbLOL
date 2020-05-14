const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const cookieParser = require("cookie-parser");
const express = require("express");
const secret = require("./secret");


module.exports = async function(req,res,next){

    //Hämta våra användare från db/fil
    //const users = require("./users");

    const users = await req.userdata.find().toArray();

    const user = users.filter(function(u){

        //filtrerar och kollar om mailen är identiska
        if(req.body.email == u.email)
        {
            return true;
        }

    });
console.log(user);
    // Om Vi har en och exakt en användare med rätt email
    if(user.length === 1)
    {
        //Kolla lösenord
        bcrypt.compare(req.body.password, user[0].password,function(err,success){

            if(success)
            {
                //snabbt ge en användare acces till en server
                const token = jwt.sign({email:user[0].email}, secret,{expiresIn:6000});

                //cookies skickar data utan clienten märker ochså väldigt säkert då man kan ej ändra det.
                res.cookie("token",token,{httpOnly:true,sameSite:"strict"});
                res.redirect("/");
            }
            else
            {
                //kommer tbx till login (skadisplaya ngt här)
                res.redirect('/login');
                
            }

        });

    }
    else
    {
        //kommer tbx till login (skadisplaya ngt här)
        res.redirect('/login');
        
    }
}