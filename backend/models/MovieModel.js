const mongoose = require('mongoose');

const MovieSchema = new mongoose.Schema({
    title: String,
    director: String
});

const MovieModel = mongoose.model('movie', MovieSchema);

module.exports = MovieModel;