'use strict';

const express = require('express');
const { Course, User } = require('../models');
const { asyncHandler } = require('../middleware/async-handler');
const { authenticateUser } = require('../middleware/auth-user');

const router = express.Router();

// Return a list of all courses and the associated user
router.get('/', asyncHandler(async(req, res) => {
    const courses = await Course.findAll({
        include: [{
            model: User,
            as: 'user',
            attributes: ['id', 'firstName', 'lastName', 'emailAddress']
        }],
        attributes: ['id', 'title', 'description', 'estimatedTime', 'materialsNeeded']
    });
    
    res.json(courses);
}));

// Return the specified course and the associated user
router.get('/:id', asyncHandler(async(req, res) => {
    const course = await Course.findOne({
        where: {
            id: req.params.id
        },
        include: [{
          model: User,
          as: 'user',
          attributes: ['firstName', 'lastName', 'emailAddress']
        }],
        attributes: ['title', 'description', 'estimatedTime', 'materialsNeeded']
    });

    if(course !== null ) {
        res.json(course);
    } else {
        res.status(200).json({"message":"Course not found"});
    }
}));

// Create a new course
router.post('/', authenticateUser, asyncHandler(async(req, res) => {
    try {
        await Course.create(req.body);
        res.status(201).end();
    } catch (error) {
        if(error.name === 'SequelizeValidationError' || error.name === 'SequelizeUniqueConstraintError'){
            const errors = error.errors.map(err => err.message);
            res.status(400).json({ errors });  
        } else {
            throw error;
        }
    }
}));

// Update the specified course
router.put('/:id', authenticateUser, asyncHandler(async(req, res) => {
    try {
        // Users can only update their own courses
        if(req.params.id == req.currentUser.id) {
            const course = await Course.update(req.body, {
                where: {
                    id: req.params.id
                }
            }).then(function(){
                res.status(204).end();
            });
        } else {
            res.status(403).json({"message":"You can only update your own courses"});
        }
    } catch (error) {
        if(error.name === 'SequelizeValidationError' || error.name === 'SequelizeUniqueConstraintError'){
            const errors = error.errors.map(err => err.message);
            res.status(400).json({ errors });  
        } else {
            throw error;
        }
    }
}));

// Delete the specified course
router.delete('/:id', authenticateUser, asyncHandler(async(req, res) => {
    // Users can only delete their own courses
    if(req.params.id == req.currentUser.id) {
        await Course.destroy({
            where: {
                id: req.params.id
            }
        }).then(function(){
            res.status(204).end();
        });
    } else {
        res.status(403).json({"message":"You can only delete your own courses"});
    }
}));

module.exports = router;