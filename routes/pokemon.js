const express = require('express');
const db = require('../models');
const router = express.Router();
const axios = require('axios');

// GET /pokemon - return a page with favorited Pokemon
router.get('/', function(req, res) {
  db.pokemon.findAll()
  .then(favorites => {
    res.render('faves.ejs', {favorites: favorites})
  })
});

// POST /pokemon - receive the name of a pokemon and add it to the database
router.post('/', function(req, res) {
  db.pokemon.create(req.body)
  .then(createdFave => {
    res.redirect('/pokemon')
  })
});

//GET /pokemon/:id route
//render show page about a pokemon by passing the pokemon's name to the PokeAPI
router.get('/:name', function(req, res) {
  const pokemonUrl = 'http://pokeapi.co/api/v2/pokemon/';
  axios.get(`http://pokeapi.co/api/v2/pokemon/${req.params.name}`)
  .then(function (apiResponse) {
    const data = {}
    function capitalizeFirstLetter(string) {
      return string.charAt(0).toUpperCase()+string.slice(1)
    }
    //list of characteristics to be added to data object
    data.name = apiResponse.data.name;
    data.moves = apiResponse.data.moves;
    data.abilities = apiResponse.data.abilities;
    data.height = apiResponse.data.height;
    data.weight = apiResponse.data.weight;
    data.image = apiResponse.data.sprites.other.dream_world.front_default;
    data.type = apiResponse.data.types;
    data.stats = apiResponse.data.stats;
    res.render('show', data);
  })
  .catch(err => {
    console.log(err)
  })
});

//DELETE FAVORITE ROUTE
router.post('/:name', (req, res) => {
  console.log('DELETED--->', req.params)
  db.pokemon.destroy({
    where: {name: req.params.name}
  })
  .then(function () {
    res.redirect('/pokemon')
  })
})

module.exports = router;
