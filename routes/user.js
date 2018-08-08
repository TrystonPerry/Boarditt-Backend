const express = require('express'),
      router = express.Router(),
      bcrypt = require('bcrypt'),
      jwt = require('jsonwebtoken');

const User = require('../models/user');


router.post('/signup', (req, res, next) => {
  if(!req.body.email || !req.body.password){
    console.log(req.body);
    return res.json({res: 'Please provide a email and password'});
  }
  bcrypt.hash(req.body.password, Number(process.env.HASH_KEY), (err, hash) => {
    if(err) {
      return res.status(500).json({err});
    } else {
      const user = new User({
        email: req.body.email,
        password: hash
      })
      user.save()
      // .then(data => sendMsg('User created!', res))
      .catch(err => {
        // if(err.code = 11000) sendErr(err, 'User creation failed', res); // TODO make better error code check system
      });
    }
  })
})

router.post('/login', (req, res, next) => {
  User.find({email: req.body.email})
  .then(user => {
    if(user.length < 1){
      return res.status(404).json({msg: 'Username or Password invalid'});
    }
    bcrypt.compare(req.body.password, user[0].password, (err, result) => {
      if(err) {
        return res.status(404).json({msg: 'Username or Password invalid'});
      } 
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
      res.status(401).json({msg: 'Username or Password invalid'});
    })
  })
})

module.exports = router;