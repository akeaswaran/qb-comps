const axios = require("axios");
const express = require('express');
const router = express.Router();
const baseURL = "https://project.trumedianetworks.com"

async function retrieveToken() {
    let tokenContent = await get("/api/token", {
        apiKey: process.env.TRUMEDIA_API_KEY
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
        return {
            status: "error",
            message: err
        }
    }
}

async function retrievePlayer(id) {
    try {
        let tokenData = await retrieveToken()
        return await get(`/api/nfl/player/${id}`, {
            tempToken: tokenData
        });
    } catch (err) {
        return {
            status: "error",
            message: err
        }
    }
}

async function get(url, params) {
    const res =  await axios.get(`${baseURL}${url}`, {
        protocol: "https",
        params: params,
        accept: "application/json"
    })

    let content = res.data;
    if (content == null) {
        throw Error(`Data not available for GET endpoint ${url}.`)
    }

    return content;
}

async function post(url, body, params) {
    const res =  await axios.post(`${baseURL}/${url}`, body, {
        protocol: "https",
        params: params
    })

    let content = res.data;
    if (content == null) {
        throw Error(`Data not available for POST endpoint ${url}.`)
    }

    return content;
}

router.get("/players", async (req, res) => {
    let result = await retrievePlayers()
    return res.json(result);
})

router.get("/player/:playerId", async (req, res) => {
    let result = await retrievePlayer(req.playerId)
    return res.json(result);
})

module.exports = router;