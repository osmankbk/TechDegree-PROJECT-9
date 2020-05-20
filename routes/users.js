const bcryptjs = require('bcryptjs');
const auth = require('basic-auth');
const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator/check');
const { User } = require('../models');
const { Op } = require('sequelize');

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

//Authenticate users
const authenticateUser = async(req, res, next) => {
    let message = null;
    try {
        const credentials = auth(req);
        if(credentials){
            const user = await User.findOne({
                where:{
                    emailAddress: {
                        [Op.eq]: credentials.name
                    }
                }
            });
            if(user){
                const authenticated = bcryptjs
                .compareSync(credentials.pass, user.password);
                if(authenticated){
                    console.log(`Authentication successful for username ${user.emailAddress}`)
                    req.currentUser = user;
                } else {
                    message = `Authentication failure for username ${user.emailAddress}`;
                }
            } else {
                message = `User not found for username ${credentials.name}`;
            }
        } else {
            message = `Auth header not found`;
        }
        if(message){
            console.warn(message);
            res.status(401).json({message: 'Access Denied'});
        } else {
            next();
        }
    } catch(error){
        console.log({error: error.message});
    }
    
}
//Get users
router.get('/users', authenticateUser, asyncEnvelop(async(req, res) =>{
        const user = req.currentUser;
        const users = await User.findByPk(user.id);
        res.status(200).json(users);
}));
//Post Users
router.post('/users', [
    check('firstName')
    .exists({checkNull: true, checkFalsy: true})
    .withMessage('A first name is required'),
    check('lastName')
    .exists({checkNull: true, checkFalsy: true})
    .withMessage('A last name is required'),
    check('emailAddress')
    .exists({checkNull: true, checkFalsy: true})
    .withMessage('An e-mail address is required'),
    check('password')
    .exists({checkNull: true, checkFalsy: true})
    .withMessage('A password is required')
], asyncEnvelop(async(req, res) => {
    const errors = validationResult(req);
    let user = req.body;
    if(!errors.isEmpty()){
        const errorMessage = errors.array().map(err => err.msg);
        res.status(400).json({errors: errorMessage});
    } else {
        user.password = bcryptjs.hashSync(user.password);
        user = await User.create(req.body);
        res.status(201).location('/').end();
    }
}));

module.exports = router;