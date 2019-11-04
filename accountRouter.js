const express = require('express');
const router = express.Router();

const db = require('./data/dbConfig.js');

router.post('/', [validateBody], async (req,res) => {
    try {
        const result = await db('accounts').insert({
            name: req.body.name,
            budget: req.body.budget
        })
        res.status(201).json({message: `account with id ${result} has been created`})
    } 
    catch(error) {
        res.status(500).json({error: 'Account information could not be saved to db ' + error })
    }
    
})

router.get('/', (req,res) => {
    db('accounts')
        .then(response => {
            res.status(200).json(response)
        })
        .catch(err => {
            res.status(500).json({error: 'An error occured retrieving accounts ' + err})
        })
})

router.get('/:id', [validateId], (req,res) => {
    res.json(req.account)
})


function validateId(req,res,next){
    const id = req.params.id;
    if (parseInt(id) > 0){
        db('accounts').where({id: id})
            .then(response => {
                if(response.length > 0){
                    req.account = response[0]
                    next();
                }
                else {
                    res.status(404).json({message: 'Account with specified ID could not be found'})
                }
            })
            .catch(err => {
                res.status(500).json({error: 'An error occurred retrieving account ' + err})
            })
    } else {
        res.status(400).json({message: 'Input a valid ID'})
    }
}

function validateBody(req,res,next){
    if (Object.keys(req.body).length > 0){
        if(req.body.name && req.body.budget){
            next();
        } else {
            res.status(400).json({message: 'Missing name or budget field'})
        }
    } else {
        res.status(400).json({message: 'Enter Account Data'})
    }
}

module.exports = router