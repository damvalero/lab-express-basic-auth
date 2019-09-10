'use strict';//HERE IS NECESARY THAT WE PUT USE STRICT

const { Router } = require('express');
const router = Router();
const User = require('./../models/user');
const bcrypt = require('bcrypt');

const routeGuardMiddleware = (req, res, next) => {
    if (!req.session.user) {
      res.redirect('/authentication/sign-in');
    } else {
      next();
    }
  };

router.get('/sign-up', (req, res, next) => {
    res.render('sign-up');
});

router.post('/sign-up', (req, res, next) => {
    const username = req.body.username; // body because we require the information iside the body of html
    const password = req.body.password;
    
    bcrypt.hash(password, 10)
    .then(hash => {
        return User.create ({
            username,
            passwordHash: hash //here is the hash given a string parameter is going to create a encrypted code
        });
    })
    .catch (error => {
        console.log ('There was an error creating the user');
    });
});

router.get('/sign-in', (req, res, next) => {
    res.render('sign-in');
});

router.post('/sign-in', (req, res, next) => {
    const username = req.body.username;
    const password = req.body.password;

    let auxiliaryUser;

    User.findOne ( {username} )
    .then (user => {
        if (!user) {
            throw new Error('USER NOT FOUND');
        } else {
            auxiliaryUser = user;
            return bcrypt.compare(password, user.passwordHash);
        }//check(for that readson we use compare) if the passwor put is the same create, paswordHash
    })
    .then(matches => {
        if (!matches){
            throw new Error ('PASSWORD DOESNT MATCH');
        } else {
            req.session.user = {
                _id: auxiliaryUser._id
            };
         res.redirect('private');
        }
    })
    .catch(error => {
        console.log('There was an error login in your account')
    })
})

router.get('/private', routeGuardMiddleware, (req, res, next) => {
    res.render('private');
  });

module.exports = router;// i have to exxport this information to router