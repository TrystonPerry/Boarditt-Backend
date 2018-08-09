const express = require('express'),
      router = express.Router(),
      bcrypt = require('bcrypt'),
      jwt = require('jsonwebtoken');

const User = require('../models/user');

const response = require('../functions/response');

router.post('/signup', (req, res, next) => {
  if(!req.body.email || !req.body.password){
    return response.sendErr(500, 'Please provide an email or password', res);
  }
  bcrypt.hash(req.body.password, Number(process.env.HASH_KEY), (err, hash) => {
    if(err) return response.sendErr(500, 'Error signing up')
    const user = new User({
      email: req.body.email,
      password: hash
    })
    user.save()
    .catch(err => {
      if(err.code = 11000) response.sendErr(500, 'Could not save user', res, err);
    });
  })
})

router.post('/login', (req, res, next) => {
  User.find({email: req.body.email})
  .then(user => {
    if(user.length < 1) return response.sendErr(500, 'Username or password invalid', res);
    bcrypt.compare(req.body.password, user[0].password, (err, result) => {
      if(err) return response.sendErr(500, 'Username or password invalid', res);
      if(result) {
        const token = jwt.sign({
          email: user[0].email,
          userId: user[0]._id
        }, 
        process.env.HASH_KEY, 
        {
          expiresIn: '7d'
        })
        return res.status(200).json({
          msg: 'Authentication Successful',
          token
        });
      }
      response.sendErr(500, 'Username or password invalid', res);
    })
  })
})

module.exports = router;