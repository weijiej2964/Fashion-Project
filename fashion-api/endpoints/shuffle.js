let { getDatabase, ref, set } = require('firebase/database')
let { connectFirebase } = require('../config/connect_firebase.js')

const express = require('express')
const shuffle = express.Router();

app.use(express.json()) // sends json data to PostMan

// Initialize Firebase
connectFirebase()
// Initialize Realtime Database and get a reference to the service
const database = getDatabase();

// Creates an outfit based off the keyword the user sends
shuffle.post('/:user_id/inventory/shuffle/:keyword', (req, res) => {
    res.send('POST request to shuffle an outfit')

    const keyword = req.params.keyword;

    console.log(`Successfully shuffled clothes`)
})

module.exports = shuffle