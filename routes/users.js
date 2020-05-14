const express = require('express');
const router = express.Router();
const { User } = require('../models');

//DRY async func
const asyncEnvelop = (cb) => {
    return async (req, res, next) =>{
        try {
            await cb(req, res, next) 
            
        } catch(err) {
            res.status(500).send(err.log);
            console.log(err.status);
        }
    }
}

//Get users

router.get('/users', asyncEnvelop(async(req, res) =>{
    const users = await User.findAll();
    res.status(200).json(users);
}));

module.exports = router;