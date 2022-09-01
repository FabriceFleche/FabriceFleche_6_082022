const Sauce = require('../models/ModelsSauce');
const fs = require('fs');

// Controleur pour la création d'une sauce
exports.createSauce = (req, res, next) => {
    const sauceObject = JSON.parse(req.body.sauce);
    delete sauceObject._id;
    delete sauceObject._userId;
    const sauce = new Sauce({
      ...sauceObject,
      userId: req.auth.userId,
      imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    });
    sauce.save()
      .then(() => { res.status(201).json({message: 'Sauce enregistrée'})})
      .catch((error) => {res.status(400).json({ error })});
  };

// Controleur pour la modification d'une sauce  
exports.modifySauce = (req, res, next) => {
    const sauceObject = req.file ? {
      ...JSON.parse(req.body.sauce),
      imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    } : { ...req.body };
    Sauce.findOne({ _id: req.params.id })
      .then((sauce) => {
        if (sauce.userId != req.auth.userId) {
          res.status(401).json({ message: 'Non autorisé' });
        } else {
          Sauce.updateOne({ _id: req.params.id}, {...sauceObject, _id: req.params.id})
          .then(() => res.status(200).json({ message: 'Sauce modifiée !'}))
          .catch((error) => {res.status(401).json({ error })});
        }
      })
      .catch((error) => {res.status(400).json({ error })});
  };      

// Controleur pour la suppression d'une sauce  
exports.deleteSauce = (req, res, next) => {
    Sauce.findOne({ _id: req.params.id })
      .then((sauce) => {
        if (sauce.userId != req.auth.userId) {
          res.status(401).json({ message: 'Non autorisé' });
        } else {
          const filename = sauce.imageUrl.split('/images/')[1];
          fs.unlink(`images/${filename}`, () => {
            Sauce.deleteOne({ _id: req.params.id })
              .then(() => res.status(200).json({ message: 'Sauce supprimée !'}))
              .catch((error) => {res.status(401).json({ error })})
          })
        }
      })  
      .catch((error) => {res.status(400).json({ error })});
};

// Controleur pour la selection d'une sauce
exports.getOneSauce = (req, res, next) => {
    Sauce.findOne({ _id: req.params.id })
      .then((sauce) => {
        res.status(200).json(sauce)
      })
      .catch((error) => {
        res.status(404).json({ error })
      });
};

// Controleur pour la récupération de toute les sauces
exports.getAllSauce = (req, res, next) => {
    Sauce.find()
      .then((sauces) => {
        res.status(200).json(sauces)
      })
      .catch((error) => {
        res.status(400).json({ error })
      });
};

// Controleur pour la gestion du like et dislike
exports.sauceLike = (req, res, next) => {
  Sauce.findOne({ _id: req.params.id })
    .then((sauce) => {

      // L utilisateur aime la sauce
      if(!sauce.usersLiked.includes(req.body.userId) && req.body.like === 1) {
        Sauce.updateOne({ _id: req.params.id  },
          {
            $inc: {likes: 1},
            $push: {usersLiked: req.body.userId}
          })
          .then(() => res.status(201).json({ message: 'Vous avez aimé cette sauce !'}))
          .catch((error) => {res.status(400).json({ error })});

      // L utilisateur annule son like    
      } else if (sauce.usersLiked.includes(req.body.userId)) {
        Sauce.updateOne({ _id: req.params.id  },
          { 
            $inc: {likes: -1},
            $pull: {usersLiked: req.body.userId}
          })
          .then(() => res.status(201).json({ message: "Le like de cette sauce a été annulé !" }))
          .catch((error) => {res.status(400).json({ error })});
      // L utilisateur n aime pas la sauce    
      } else if (!sauce.usersDisliked.includes(req.body.userId) && req.body.like === -1) {
        Sauce.updateOne({ _id: req.params.id  },
          {
            $inc: {dislikes: 1},
            $push: {usersDisliked: req.body.userId}
          })
          .then(() => res.status(201).json({ message: "Vous n'aimez pas cette sauce !" }))
          .catch((error) => {res.status(400).json({ error })});
      } else if (sauce.usersDisliked.includes(req.body.userId)) {
        Sauce.updateOne({ _id: req.params.id  },
          {
            $inc: {dislikes: -1},
            $pull: {usersDisliked: req.body.userId}
          })
          .then(() => res.status(201).json({ message: "Le dislike de cette sauce a été annulé !" }))
          .catch((error) => {res.status(400).json({ error })});
      }
    })
    .catch((error) => {res.status(404).json({ error })});
}
