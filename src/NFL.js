const axios = require("axios");
const express = require('express');
const moment = require('moment');

const router = express.Router();
const baseURL = "https://project.trumedianetworks.com"
require('dotenv').config();

//  Provided by teamcolorcodes.com
let teamColors = {
    "JAX" : "#006778",
    "OAK" : "#000000",
    "CLE" : "#FF3C00"
}

async function retrieveToken() {
    let tokenContent = await get("/api/token", {
        apiKey: process.env.TRUMEDIA_API_KEY,
        'Content-Type': 'application/json'
    })
    return tokenContent.token
}

async function retrievePlayers() {
    try {
        let tokenData = await retrieveToken()
        return await get("/api/nfl/players", {
            tempToken: tokenData
        });
    } catch (err) {
        return err
    }
}

async function retrieveExtendedPlayers() {
    try {
        let tokenData = await retrieveToken()
        let players = await get("/api/nfl/players", {
            tempToken: tokenData
        });

        if (players.length > 0) {
            var playerPromiseSet = []
            players.forEach(item => {
                playerPromiseSet.push(retrievePlayer(item.playerId))
            })
            var results = await Promise.all(playerPromiseSet)
            results = results.reduce((a, n) => a = a.concat(n), [])
            return results;
        } else {
            return []
        }
    } catch (err) {
        return err
    }
}

async function retrievePlayer(id) {
    try {
        let tokenData = await retrieveToken()
        var games = await get(`/api/nfl/player/${id}`, {
            tempToken: tokenData
        });
        games.forEach(gm => {
            gm.gameDate = moment(gm.gameDate).format("M/DD, h:mma")
        })
        return games
    } catch (err) {
        return err
    }
}

async function get(url, headers) {
    const res = await axios({
        method: 'GET',
        url: `${baseURL}${url}`,
        headers: headers
    })

    let content = res.data;
    if (content == null) {
        throw Error(`Data not available for GET endpoint ${url}.`)
    }

    return content;
}

router.get('/', async (req, res) => {
    return await res.redirect('/nfl/players/extended');
});

router.route("/players")
    .post(async (req, res) => {
        let result = await retrievePlayers()
        return res.json(result);
    })
    .get(async (req, res) => {
        let result = await retrievePlayers()
        return res.render("list", {
            players: result
        })
    })

router.route("/players/extended")
    .post(async (req, res) => {
        let result = await retrieveExtendedPlayers()
        return res.json(result);
    })
    .get(async (req, res) => {
        let result = await retrieveExtendedPlayers()
        return res.render("list", {
            players: result
        })
    })

router.route("/player/:playerId")
    .post(async (req, res) => {
        let result = await retrievePlayer(req.params.playerId)
        return res.json(result);
    })
    .get(async (req, res) => {
        let result = await retrievePlayer(req.params.playerId)
        return res.render("player", {
            games: result,
            player: {
                fullName: result[0].fullName,
                playerImage: result[0].playerImage,
                teamImage: result[0].teamImage,
                team: result[0].team,
                teamColor: teamColors[result[0].team]
            }
        })
    })

module.exports = router;