var mongoose = require('mongoose');

module.exports = mongoose.model('belovePokemon',{
    username: String,
    pokemonID: String
});