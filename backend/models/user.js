const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

// Creation du schema utilisateur
const userSchema = mongoose.Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
});

// Integration du plugin UniqueValidator au schema utilisateur
userSchema.plugin(uniqueValidator);

module.exports = mongoose.model('User', userSchema);