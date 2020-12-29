const express = require('express');
const router = express.Router();
const Bank = require('../models/Bank');

//All Banks
router.get('/banks', (req,res) => {
    Bank.find()
        .then((result) => {
            // res.send(result);
            res.render('all_banks', {banks: result});
        })
        .catch(err => {
            console.log(err);
        })        
});

//Particular Bank Details
// router.get('/banks/:id', (req,res) => {
//     Bank.findById(req.params.id)
//         .then((result) => {
//             // res.send(result);
//             res.render('details', {bank: result});
//         })
//         .catch(err => {
//             console.log(err);
//         })        
// });

//Update Bank DB
router.put('/:id', (req,res) => {
    Bank.findById({_id: req.params.id})
    .then((result) => {
        // const blood = result+req.body;
        const blood = result;
        blood.AP = blood.AP + req.body.AP;
        blood.AN = blood.AN + req.body.AN;
        blood.BP = blood.BP + req.body.BP;
        blood.BN = blood.BN + req.body.BN;
        blood.ABP = blood.ABP + req.body.ABP;
        blood.ABN = blood.ABN + req.body.ABN;
        blood.OP = blood.OP + req.body.OP;
        blood.ON = blood.ON + req.body.ON;
        Bank.findByIdAndUpdate({_id: req.params.id}, blood, (err, bl) => {
            if(err){
                console.log(err);
            }
        })
        .then(sol => {
            res.send(sol);
        })
    });
});

module.exports = router;