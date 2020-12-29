const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Bank = require('../models/Bank');
const Donate = require('../models/Donate');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken'); 
const { requireAuth, checkUser } = require('../middleware/authMiddleware');

const validateRegisterInput = require('../validations/registration');
const validateLoginInput = require('../validations/login');
const validatebankInput = require('../validations/bank');

// create json web token
const maxAge = 3 * 24 * 60 * 60;
const createToken = (payload) => {
    return jwt.sign(payload , 'net ninja secret', {
      expiresIn: maxAge
    });
  };

router.get('/signup', (req, res)=>{
    res.render('signup')
})

router.get("/login", (req, res) =>{
    res.render('login')
})

router.get("/AddDetails" , requireAuth, (req, res) =>{
    res.render("donation")
})

router.post('/signup', (req, res)=>{

    const {name, contact, blood_group , password} = req.body;

    console.log(name, contact, blood_group, password);

    //console.log(bg);


    const {isValid, errors} = validateRegisterInput(req.body);

    

    if(!isValid){
           return res.status(400).json({errors}); 
    }

    User.findOne({contact : contact}).then((user) =>{
        if(user){
            errors.contact = 'Contact already exists';
            return res.status(400).json({errors});
        }

        const user1 = new User({
            name,
            contact,
            blood_group,
            password
        }) 

        bcrypt.genSalt(10, (err, salt)=>{
            bcrypt.hash(password,salt, (err, hash)=>{
                    if(err) throw err;
                   user1.password = hash; 

                user1.save().then(user=>{
                    res.json({user : user});
                })
                .catch(err=> console.log(err))                    
                })
        })
    })
    .catch(err => console.log(err));
})


router.post('/login', (req, res)=>{

    const {errors, isValid } = validateLoginInput(req.body)

    if(!isValid) {
       return res.status(400).json({errors})
    }

    const contact = req.body.contact
    const password = req.body.password
    //find the user by email
    User.findOne({contact}).then(user =>{
            //check for user
        if(!user){
            errors.contact = 'Contact Number not found'
            return res.status(400).json({errors})
        }
        
        bcrypt.compare(password, user.password)
            .then(isMatch =>{
                if(isMatch){
                    //User matched

                    const payload = {name : user.name, id : user._id, contact : user.contact, bg : user.blood_group }  //create JWT payload
    
                    //Sign Token
                    const token = createToken(payload);
                    res.cookie('jwt', token, {httpOnly : true, maxAge : maxAge*1000 });
                    res.status(201).json({user : user._id});
                    //res.redirect("/AddDetails")
                }
                else {
                    errors.password = 'Password Incorrect'
                    return res.status(400).json({errors})
                }
            })
    })
    .catch(err => console.log(err))
})

router.post("/AddDetails", (req, res, next) =>{

    const {bank_name , amount } = req.body;

    const {isValid, errors} = validatebankInput(req.body);

    if(!isValid) {
        return res.status(400).json(errors)
    }

    Bank.find({name : bank_name}).then(result =>{
        console.log(bank_name);
        console.log(result);
        if(!(result[0])){
            errors.name = "Blood Bank not found";
            return res.status(400).json({errors});
        }
    })

    const token = req.cookies.jwt;
    if(token){
        jwt.verify(token, 'net ninja secret',async (err, decodedToken)=>{
            if(err){
                console.log(err);
                next();
            } else{
                let user = await User.findById(decodedToken.id);
                res.locals.user = user;
                const bg = user.blood_group;
                Bank.find({name : bank_name})
                .then((result) => {
                    // const blood = result+req.body;
                    const blood = result[0];
                    console.log(blood);
                    console.log(bg);
                    const amt = parseInt(amount,10);
                    if(bg=="A+")
                        blood.AP = blood.AP + amt;
                    if(bg=="A-")
                        blood.AN = blood.AN + amt;
                    if(bg=="B+")
                        blood.BP = blood.BP + amt;
                    if(bg=="B-")
                        blood.BN = blood.BN + amt;
                    if(bg=="AB+")
                        blood.ABP = blood.ABP + amt;
                    if(bg=="AB-")
                        blood.ABN = blood.ABN + amt;
                    if(bg=="O+")
                        blood.OP = blood.OP + amt;
                    if(bg=="O-")
                        blood.ON = blood.ON + amt;
                    console.log(blood);
                    Donate.create({donar: user._id, donar_name: user.name, bank_name: bank_name, quantity: amount, blood_group: bg});
                    Bank.findByIdAndUpdate({_id: blood._id}, blood, (err, bl) => {
                        if(err){
                            console.log(err);
                        }
                    })
                    .then(sol => {
                        console.log(sol);
                    })
                });
                next();
            }
        })
    } else {
        next();
    }


});

router.get('/logout', (req, res)=>{
    res.cookie('jwt', '', { maxAge : 1 });
    res.redirect('/');
});

//users donated history
router.get('/userHistory/:id', (req,res) => {
    
    const id = req.params.id;
    console.log(id);
    Donate.find({donar : id})
    .then(result => {
        // result.forEach(x => {
        //     console.log(x.bank_name, x.quantity, x.donation_date);
        // });
        const d = result;
        console.log(result);
        res.render('userHistory', {donate: d});
    })
    .catch(er => {
        console.log(er);
    });

    // const token = req.cookies.jwt;
    // if(token){
    //     jwt.verify(token, 'net ninja secret',async (err, decodedToken)=>{
    //         if(err){
    //             console.log(err);
    //             next();
    //         } else{
    //             let user = await User.findById(decodedToken.id);
    //             const id = user._id;
    //             const bg = user.blood_group;
    //             Donate.find({donar : id})
    //             .then(result => {
    //                 // result.forEach(x => {
    //                 //     console.log(x.bank_name, x.quantity, x.donation_date);
    //                 // });
    //                 const d = result;
    //                 console.log(result);
    //                 res.render('userHistory', {donate: d});
    //             })
    //             .catch(er => {
    //                 console.log(er);
    //             });
    //             next();
    //         }
    //     })
    // } else {
    //     next();
    // }
})


module.exports = router;