'use strict';

const express = require('express');
const { Course, User } = require('../models');
const { asyncHandler } = require('../middleware/async-handler');
const { authenticateUser } = require('../middleware/auth-user');

const router = express.Router();
const bcrypt = require('bcrypt');

// Route that returns the currently authenticated user
router.get('/', authenticateUser, asyncHandler(async(req, res) => {
    const user = req.currentUser;
    res.json({
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        emailAddress: user.emailAddress
    });
}));

// Route that returns a list of users.
router.post('/', asyncHandler(async(req, res) => {
    try {
        let data = req.body;
        data.password_validate = data.password;
        let user = await User.create(req.body);
        console.log(user);  
        user.save()
            .then( function() {         
                res.status(201).end();
            })
            .catch( function(error) {
                console.log(error.name)
                if(error.name === 'SequelizeValidationError' || error.name === 'SequelizeUniqueConstraintError'){
                    const errors = error.errors.map(err => err.message);
                    res.status(400).json({ errors });  
                } else {
                    throw error;
                }
            });
    } catch (error) {
       throw error;
    }
}));

module.exports = router;