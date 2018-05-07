const express = require('express');
const router = express.Router();
const gravatar = require('gravatar');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const keys = require('../../config/keys');


const User = require('../../models/User');

// @route  GET /api/users/test
// @desc   Tests users route
// @access PUBLIC
router.get('/test', (req, res) => res.json({msg: "Users works"}));

// @route  POST /api/users/register
// @desc   Register User
// @access PUBLIC
router.post('/register', (req, res) => {
  User.findOne({email: req.body.email})
      .then(user => {
        if(user) {
          return res.status(400).json({email: 'Email already exists'});
        } else {
          const avatar = gravatar.url(req.body.email, {
            s: '200', //Size
            r: 'pg',  //Rating
            d: 'mm'   //Default
          });
          const newUser = new User({
            name: req.body.name,
            email: req.body.email,
            password: req.body.password,
            avatar
          })

          //Encrypt the password before saving the new user
          bcrypt.genSalt(10, (err, salt) => {
            bcrypt.hash(newUser.password, salt, (err, hash) => {
              if(err) throw err;
              newUser.password = hash;
              newUser
                .save()
                .then(user => res.json(user))
                .catch(err => console.log(err));
            })
          })
        }
      })
});

// @route  POST /api/users/login
// @desc   Accepts email and password and returns a JWT token
// @access PUBLIC
router.post('/login', (req, res) => {
  const email = req.body.email;
  const password = req.body.password;

  User.findOne({email: email})
    .then(user => {
      if(!user) {
        return res.status(400).json({email: 'User not found'});
      }

      bcrypt.compare(password, user.password)
        .then(isMatch => {
          if(isMatch) {
            //jwt sign token
            const payload = {id: user.id, name: user.name, avatar: user.avatar};
            jwt.sign(payload, keys.secretKey, {expiresIn: 60}, (err, token) => {
              res.json({
                status: 'Success',
                token: `Bearer ${token}`
              });
            })
          } else {
            return res.status(400).json({password: 'Password Incorrect'});
          }
        });
    });
});


module.exports = router;
