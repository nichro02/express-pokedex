const express = require('express');
const db = require('../models');
const router = express.Router();
const axios = require('axios');

// GET /pokemon - return a page with favorited Pokemon
router.get('/', function(req, res) {
  // TODO: Get all records from the DB and render to view
  db.pokemon.findAll()
  .then(favorites => {
    console.log('SQL---->',db.pokemon.findAll())
    res.render('faves.ejs', {favorites: favorites})
  })
});

// POST /pokemon - receive the name of a pokemon and add it to the database
router.post('/', function(req, res) {
  // TODO: Get form data and add a new record to DB
  //res.send(req.body);
  db.pokemon.create(req.body)
  .then(createdFave => {
    res.redirect('/pokemon')
  })
});
/*
router.post('/faves', (req, res) => {
  let newFavorite = req.body
  console.log(newFavorite)
  db.fave.findOrCreate ({
      where: {title: newFavorite.title},
      defaults: {imdbid: newFavorite.imdbid}
  })
  .then(([createdFave, wasCreated]) => {
      res.redirect('/movies/faves')
  })
})
*/
//GET /pokemon/:id route
//render show page about a pokemon by passing the pokemon's name to the PokeAPI
router.get('/:name', function(req, res) {
  const pokemonUrl = 'http://pokeapi.co/api/v2/pokemon/';
  //console.log(req.params.name)
  
  axios.get(`http://pokeapi.co/api/v2/pokemon/${req.params.name}`)
  .then(function (apiResponse) {
    const data = {}
    function capitalizeFirstLetter(string) {
      return string.charAt(0).toUpperCase()+string.slice(1)
    }
    //list of characteristics to be added to data object
    //data.name = apiResponse.data.name;
    //data.name = capitalizeFirstLetter(apiResponse.data.name);
    data.name = apiResponse.data.name;
    data.moves = apiResponse.data.moves;
    data.abilities = apiResponse.data.abilities;
    data.height = apiResponse.data.height;
    data.weight = apiResponse.data.weight;
    data.image = apiResponse.data.sprites.other.dream_world.front_default;
    data.type = apiResponse.data.types;
    data.stats = apiResponse.data.stats;
    console.log('TYPE---->',data.type)
    //console.log('MOVES INFO--->',data.moves)
    console.log('IMG ---->', data.image)
    //const pokemonName = apiResponse.data.name;
    //console.log('IS THERE A NAME? ',pokemonName)
    //console.log('here is the pokemon info: ',apiResponse.data)
    res.render('show', data);
  })
  .catch(err => {
    console.log(err)
  })
});

module.exports = router;
