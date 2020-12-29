const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Admin = require('../models/Admin');

const requireAuth = (req, res, next) =>{

    const token = req.cookies.jwt;


    //check jsonwebtoken exists and is verified
    if(token){
        jwt.verify(token, 'net ninja secret', (err, decodedToken)=>{
            if(err){
                res.redirect('/login');
            } else{
              //  console.log(decodedToken);
                next();
            }

        })
    } else {
        res.redirect('/login');
    }
}

const checkUser = (req, res, next) => {

    const token = req.cookies.jwt;

    if(token){
        jwt.verify(token, 'net ninja secret',async (err, decodedToken)=>{
            if(err){
                res.locals.user = null;
                next();
            } else{
                let user = await User.findById(decodedToken.id);
                res.locals.user = user;
                next();
            }

        })
    } else {
        res.locals.user = null;
        next();
    }

}

const checkAdmin = (req, res, next) => {

    const token = req.cookies.jwt;

    if(token){
        jwt.verify(token, 'net ninja secret',async (err, decodedToken)=>{
            if(err){
                res.locals.admin = null;
                next();
            } else{
                let admin = await Admin.findById(decodedToken.id);
                res.locals.admin = admin;
                next();
            }

        })
    } else {
        res.locals.admin = null;
        next();
    }

}

module.exports = {requireAuth, checkUser, checkAdmin };