const express = require('express');
const router = express.Router();
const { User, Course } = require('../models');

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
//Post Users
router.post('/users', asyncEnvelop(async(req, res) => {
    let user;
    try{
        user = await User.create(req.body);
        res.status(201).end();
    }catch(err) {
        throw err;
    }
}));

//Get courses
router.get('/courses', asyncEnvelop(async(req, res) =>{
    const course = await Course.findAll();
    res.status(200).json(course);
}));

//Get A course
router.get('/courses/:id', asyncEnvelop(async(req, res) =>{
    const course = await Course.findByPk(req.params.id);
    if(course) {
        res.status(200).json(course);
    } else {
        res.status(404).json({'error': 'course not available'});
    }
    
}));

//Post course
router.post('/courses', asyncEnvelop(async(req, res) => {
    let course;
    try{
        course = await Course.create(req.body);
        res.status(201).end();
    }catch(err) {
        console.error({error: err});
    }
}));

//Update course
router.put('/courses/:id', asyncEnvelop(async(req, res) =>{
    const course = await Course.findByPk(req.params.id);
    if(course) {
        course = course.update(req.body);
        res.status(201).end();
    } else {
        res.status(404).json({'error': 'course not available'});
    }
    
}));

//Delete course
router.delete('/courses/:id', asyncEnvelop(async(req, res) =>{
    const course = await Course.findByPk(req.params.id);
    if(course) {
        await course.destroy();
        res.status(204).end();
    } else {
        res.status(404).json({'error': 'course not available'});
    }
    
}));
module.exports = router;