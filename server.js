require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const helmet = require('helmet')
const cors = require('cors')
const POKEDEX = require('./pokedex')

const app = express()
const morganSetting = process.env.NODE_ENV === 'production' ? 'tiny' : 'common';
app.use(morgan(morganSetting))
app.use(helmet())
app.use(cors())

app.use(function validateBearerToken(req, res, next) {
    const authToken = req.get('Authorization');
    const apiToken = process.env.API_TOKEN;

    if( !authToken || authToken.split(' ')[1] !== apiToken) {
        return res
            .status(401)
            .json({error: 'unauthorized request'})
    }
    next()
})

const validTypes = [`Bug`, `Dark`, `Dragon`, `Electric`, `Fairy`, `Fighting`, `Fire`, `Flying`, `Ghost`, `Grass`, `Ground`, `Ice`, `Normal`, `Poison`, `Psychic`, `Rock`, `Steel`, `Water`]

function handleGetTypes(req, res) {
    res.json(validTypes);
}

app.get('/types', handleGetTypes)

function handleGetPokemon(req, res) {
    const { name, type } = req.query;
    let response = POKEDEX.pokemon;

    if(name) {
        response = response.filter(pokemon => {
            return(
                pokemon
                .name
                .toLowerCase()
                .includes(name.toLowerCase())
            )
        })
    };

    if(type) {
         response = response.filter(pokemon => {
            return(
                pokemon
                .name
                .toLowerCase()
                .includes(type.toLowerCase())
            )
        })
    }

    res.json(response);

}

app.get('/pokemon', handleGetPokemon)

app.use((error, req, res, next) => {
    let response
    if (process.env.NODE_ENV === 'production') {
        response = {error: {message: 'Server error'}}
    } else {
        response = {error}
    }
    res.status(500).json(response)
})

const  PORT = process.env.PORT || 8001;

app.listen(PORT, () => {
    console.log(`server is listening at http:\\localhost:${PORT}`);
})
