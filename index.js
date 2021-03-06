require('dotenv').config();
const express = require('express');
const axios = require('axios'); 
const ejsLayouts = require('express-ejs-layouts');
const app = express();
const port = process.env.PORT || 3000;
const db = require('./models');

app.use(require('morgan')('dev'));
app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: false }));
app.use(ejsLayouts);
app.use(express.static(__dirname + '/public'))

// GET / - main index of site
app.get('/', function(req, res) {
  const pokemonUrl = 'http://pokeapi.co/api/v2/pokemon/?limit=151';
  // Use request to call the API
  axios.get(pokemonUrl).then(function(apiResponse) {
    pokemon = apiResponse.data.results;
    res.render('index', { pokemon: pokemon.slice(0, 151) });
  })
});


// Imports all routes from the pokemon routes file
app.use('/pokemon', require('./routes/pokemon'));

const server = app.listen(port, function() {
  console.log('...listening on', port );
});
/*
db.pokemon
  .create({
    name: "pikachu",
  })
  .then(function (poke) {
    console.log("Created: ", poke.name);
  });

db.pokemon.findAll().then(function (poke) {
  console.log("Found: ", poke.name);
});
*/
module.exports = server;
