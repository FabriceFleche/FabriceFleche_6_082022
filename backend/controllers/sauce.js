const sauce = require('../models/ModelsSauce');
const fs = require('fs');

exports.createSauce = (req, res, next) => {
    const sauceObject = JSON.parse(req.body.sauce);
    delete sauceObject._id;
    //delete sauceObject._userId;
    const sauce = new Sauce({
      ...sauceObject,
      //userId: req.auth.userId,
      imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    });
    sauce.save()
      .then(() => { res.status(201).json({message: 'Sauce enregistrée'})})
      .catch(error => {res.status(400).json({ error })});
  };

exports.modifySauce = (req, res, next) => {
    const sauceObject = req.file ? {
      ...JSON.parse(req.body.sauce),
      imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    } : { ...req.body };
    sauce.findOne({ _id: req.params.id })
      .then((sauce) => {
        if (sauce.userId != req.auth.userId) {
          res.status(401).json({ message: 'Non autorisé' });
        } else {
          sauce.updateOne({ _id: req.params.id}, {...sauceObject, _id: req.params.id})
          .then(() => res.status(200).json({ message: 'Sauce modifiée !'}))
          .catch(error => {res.status(401).json({ error })});
        }
      })
      .catch(error => {res.status(400).json({ error })});
  };      

exports.deleteSauce = (req, res, next) => {
    sauce.findOne({ _id: req.params.id })
      .then(sauce => {
        if (sauce.userId != req.auth.userId) {
          res.status(401).json({ message: 'Non autorisé' });
        } else {
          const filename = sauce.imageUrl.split('/images')[1];
          fs.unlink(`images/${filemane}`, () => {
            sauce.deleteOne({ _id: req.params.id })
              .then(() => res.status(200).json({ message: 'Sauce supprimée !'}))
              .catch(error => {res.status(401).json({ error })})
          })
        }
      })  
      .catch(error => res.status(400).json({ error }));
};

exports.getOneSauce = (req, res, next) => {
    sauce.findOne({ _id: req.params.id })
      .then(sauce => res.status(200).json(sauce))
      .catch(error => res.status(404).json({ error }));
  };

exports.getAllSauce = (req, res, next) => {
    sauce.find()
      .then(sauces => res.status(200).json(sauces))
      .catch(error => res.status(400).json({ error }));
  };

exports.sauceLike = (req, res, next) => {
  sauce.findOne({ _id: req.params.id })
    .then(() => res.status(201).json({ message: ''}))
    .catch(error => res.status(400).json({ error }));
};