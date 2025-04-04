let { connectFirebase } = require('../config/connect_firebase.js')
let { getDatabase, ref, set } = require('firebase/database')

const express = require('express')
const app = express()
const firebase = require('firebase/app')

app.use(express.json()) // sends json data to PostMan

// Initialize Firebase
connectFirebase()
// Initialize Realtime Database and get a reference to the service
const database = getDatabase();


const port = 3000
const server = process.env.PORT || 8080 // idk if this matters i see it everywhere tho

app.get('/', (req, res) => {
    res.send('This is our Fashion API!')
})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})

// Updates the data of a specific clothing from the user's inventory
app.put('/:user_id/inventory/:clothing_id', (req, res) => {
    res.send('PUT request to update clothing information')

    const clothing_id = req.params.clothing_id;

    console.log(`Successfully updated clothes`)
})