const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const uid2 = require("uid2");

const { checkBody } = require('../modules/checkBody');

const { 
  N_LOGIN_ATTEMPTS, 
  LOGIN_FAIL_TIMEOUT_MS,
  N_HASHING_ROUNDS,
  TOKEN_LENTGH,
} = require('../modules/auth');


const { User } = require('../database/models/users');


router.post('/signup', async (req, res) => {
  if (! checkBody(req.body, ['username', 'password']))
    return res.status(400).json({ 
      result: false, 
      error: 'Invalid request body'
    });

  const { username, password } = req.body;
  
  try{
    const user = await User.findOne({ username });
    if (user)
      return res.status(400).json({ 
        result: false, 
        error: 'A user with this username already exists' 
      });
    try{  
      const newUser = { 
        username, 
        password: bcrypt.hashSync(password, N_HASHING_ROUNDS),
        token: uid2(TOKEN_LENTGH),
        remainingLoginAttempts: N_LOGIN_ATTEMPTS,
      };
      const newUserDoc = await User.create(newUser);
      res.status(200).json({ result: true, token: newUserDoc.token });
    }
    catch(err){
      res.status(500).json({ result: false, error: err.message });
    }
  }
  catch(err){
    res.status(500).json({ result: false, error: err.message });
  }
});


router.post('/signin', async (req, res) => {
  if (! checkBody(req.body, ['username', 'password']))
    return res.status(400).json({ 
      result: false, 
      error: 'Invalid request body'
    });
  
  const { username, password } = req.body;
  
  try {
    const user = await User.findOne({ username });
    if (!user)
      return res.status(400).json({ 
        result: false, 
        error: 'No user found with the provided username' 
      });
    
    if (user.isAccountBlocked)
      return res.status(400).json({ 
        result: false, 
        error: 'Blocked account' 
      });
    
    if (user.lastFailedLoginTime !== null){
      const waitTime = new Date() - user.lastFailedLoginTime;
      if (waitTime < LOGIN_FAIL_TIMEOUT_MS){
        const secondsToWait = Math.floor((LOGIN_FAIL_TIMEOUT_MS - waitTime)/1000);
        return res.status(400).json({ 
          result: false, 
          error: `Try again in ${secondsToWait} seconds` 
        }); 
      }
    }

    if (!bcrypt.compareSync(password, user.password)){
      user.remainingLoginAttempts -= 1;
      user.lastFailedLoginTime = new Date();
      if (user.remainingLoginAttempts === 0){
        user.isAccountBlocked = true;
        await user.save();
        return res.status(400).json({ 
          result: false, 
          error: `Incorrect password. Account blocked.` 
        });
      }
      await user.save();
      return res.status(400).json({ 
        result: false, 
        error: `Incorrect password. ${user.remainingLoginAttempts} attempt(s) remaining.` 
      });
    }

    user.remainingLoginAttempts = N_LOGIN_ATTEMPTS;
    user.lastFailedLoginTime = null;
    await user.save();
    res.status(200).json({ result: true, token: user.token });
  }
  
  catch(err) {
    res.status(500).json({ result: false, error: err.message });
  }
});


module.exports = router;
