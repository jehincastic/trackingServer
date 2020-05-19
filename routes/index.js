const express = require('express');
const bcrypt = require('bcryptjs');

const { response } = require('../helpers/responses');
const User = require('../schemas/User');

const router = express.Router();

router.post('/register', async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      email,
      password,
      getEmails,
    } = req.body;
    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(password, salt);
    const userJson = {
      firstName,
      lastName,
      email,
      password: hash,
      getEmails,
    };
    const user = new User(userJson, 'register');
    const userExists = await user.getUserbyEmail();
    if (userExists) {
      throw new Error('Email Already Registered');
    }
    await user.createUser();
    response(res, user.userJson(), false);
  } catch (err) {
    response(res, err, true);
  }
});

router.post('/login', async (req, res) => {
  try {
    const {
      email,
      password,
    } = req.body;
    const userJson = {
      email,
    };
    const user = new User(userJson, 'login');
    const userExists = await user.getUserbyEmail();
    if (!userExists) {
      throw new Error('Invalid Email');
    }
    const valid = bcrypt.compareSync(password, user.password);
    if (valid) {
      response(res, user.userJson(), false);
    } else {
      throw new Error('Invalid Password');
    }
  } catch (err) {
    response(res, err, true);
  }
});

module.exports = router;
