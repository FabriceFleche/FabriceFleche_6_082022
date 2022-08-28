const express = require('express');
const routerSauce = express.Router();
const sauceCtrl = require('../controllers/sauce');
const auth = require('../middleware/auth');
const multer = require('../middleware/multer-config');

routerSauce.get('/', auth, sauceCtrl.getAllSauce);
routerSauce.post('/', auth, multer, sauceCtrl.createSauce);
routerSauce.get('/:id', auth, sauceCtrl.getOneSauce);
routerSauce.put('/:id', auth, multer, sauceCtrl.modifySauce);
routerSauce.delete('/:id', auth, sauceCtrl.deleteSauce);
routerSauce.post('/:id/like', auth, sauceCtrl.sauceLike);
  
module.exports = routerSauce;