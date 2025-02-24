// this is the main file for the api 
// PACKAGE-LOCK.JSON: i put in firebase idek if that's the version we got

const express = require('express')
const Firestore = require('@google-cloud/firestore')
const app = express()
const port = 3000

// stuff that comes with express brah
app.get('/', (req, res) => {
    res.send('This is our Fashion API!')
})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})

// no string patterns cause apparently they don't work on express 5 LOL
// Uploads clothing image and any data associated with it, stores it into the database
app.post('/clothes/upload', (req, res) => {
    res.send('POST request to upload clothing')

    console.log(`Successfully uploaded clothes`)
})

// Returns JSON (?) of all clothing items for a user
app.get('/clothes/{user_id}', (req, res) => {
    res.send('GET request to get clothing')
    console.log(`Successfully returned clothes`)
})

// Returns JSON of a specific piece of clothing the user has in their inventory
app.get('/clothes/{clothing_id}', (req, res) => {
    res.send('GET request to get clothing information')
    console.log(`Successfully returned clothing ite,`)
})

// Updates the data of a specific clothing from the user's inventory
app.put('/clothes/{clothing_id}', (req, res) => {
    res.send('PUT request to update clothing information')
    console.log(`Successfully updated clothes`)
})

// Deletes the data of a specific clothing from the user's inventory
app.delete('/clothes/{clothing_id}', (req, res) => {
    res.send('DELETE request to delete an item')
    console.log(`Successfully deleted clothes`)
})

// Creates an outfit based off the keyword the user sends
app.post('/clothes/shuffle/{keyword}', (req, res) => {
    res.send('POST request to shuffle an outfit')
    console.log(`Successfully shuffled clothes`)
})