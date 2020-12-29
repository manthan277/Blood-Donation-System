const express = require('express');
const router = express.Router();
const Donate = require('../models/Donate');
const Bank = require('../models/Bank');
const Admin = require('../models/Admin');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken'); 

const validateLoginInput = require('../validations/login');

// create json web token
const maxAge = 3 * 24 * 60 * 60;
const createToken = (payload) => {
    return jwt.sign(payload , 'net ninja secret', {
      expiresIn: maxAge
    });
  };

router.post("/adminsignup", (req, res) => {
    const {name, contact, password} = req.body;
    const admin1 = new Admin({
        name,
        contact,
        password
    }) 

    bcrypt.genSalt(10, (err, salt)=>{
        bcrypt.hash(password,salt, (err, hash)=>{
                if(err) throw err;
               admin1.password = hash; 

            admin1.save().then(admin=>{
                res.json({admin : admin});
            })
            .catch(err=> console.log(err))                    
            })
    })
})

router.get("/adminlogin", (req, res) =>{
    res.render('adminlogin')
})

router.post('/adminlogin', (req, res)=>{

    const {errors, isValid } = validateLoginInput(req.body)

    if(!isValid) {
       return res.status(400).json({errors})
    }

    const contact = req.body.contact
    const password = req.body.password
    //find the user by email
    Admin.findOne({contact}).then(admin =>{
            //check for user
        if(!admin){
            errors.contact = 'Contact Number not found'
            return res.status(400).json({errors})
        }
        
        bcrypt.compare(password, admin.password)
            .then(isMatch =>{
                if(isMatch){
                    //User matched

                    const payload = {name : admin.name, id : admin._id, contact : admin.contact }  //create JWT payload
    
                    //Sign Token
                    const token = createToken(payload);
                    res.cookie('jwt', token, {httpOnly : true, maxAge : maxAge*1000 });
                    res.status(201).json({admin : admin._id});
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

//All Donars of a bank
router.get('/banks/:id', (req,res) => {
    Bank.findOne({_id: req.params.id})
    .then((result) => {
        const bank1 = result;
        const b_name = result.name;
        Donate.find({bank_name: b_name})
        .then((result1) => {
            const donate = result1;
            // result1.forEach(x => {
            //     console.log(x.donar_name, x.blood_group, x.quantity, x.donation_date);
            // });
            console.log(bank1, donate);
            res.render('details', {bank: bank1, donate: donate});
            // res.send(result1);
        })
        .catch(err => {
            console.log(err);
        })   
    })
});

//Adding Donars
router.post('/donate', (req,res) => {
    try {
        Donate.create(req.body);
        res.send(req.body);
    } catch (err) {
        console.log(err);
        res.send(err);
    }
});

router.get('/addBank', (req,res) => {
    res.render('addBank');
})

//Adding Banks
router.post('/addBank', (req,res) => {
    try {
        Bank.create(req.body);
        res.send(req.body);
    } catch (err) {
        console.log(err);
        res.send(err);
    }
});

module.exports = router;