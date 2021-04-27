const axios = require("axios");
const express = require('express');
const router = express.Router();
const baseURL = "https://project.trumedianetworks.com"
require('dotenv').config();

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
        return await get(`/api/nfl/player/${id}`, {
            tempToken: tokenData
        });
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

router.get("/players", async (req, res) => {
    let result = await retrieveExtendedPlayers()
    return res.json(result);
})

router.get("/player/:playerId", async (req, res) => {
    let result = await retrievePlayer(req.playerId)
    return res.json(result);
})

module.exports = router;