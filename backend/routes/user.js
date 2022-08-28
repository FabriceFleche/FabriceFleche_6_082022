const express = require('express');
const routerUser = express.Router();
const userCtrl = require('../controllers/user');

routerUser.post('/signup', userCtrl.signup);
routerUser.post('/login', userCtrl.login);

module.exports = routerUser;