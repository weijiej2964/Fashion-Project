// this is the main file for the api 
// PACKAGE-LOCK.JSON: i put in firebase idek if that's the version we got
// 2/24/25 comment: okay this doesn't work until firebase is actually in it's just placeholder 
// to do: connect with firebase auth to only allow authorized users

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
app.post('/inventory/upload', async (req, res) => { // does this have to be async? idk lets find out 
    const data = {
        // need item id...
        // idea: gen random number based off of params. keep checking if it doesn't exist and only stop if it's unique in the db for the user
        clothing_name: req.body.clothing_name,
        image: req.body.image,
        category: req.body.category,
        tags: req.body.tags
    };

    await db.collection('inventory').doc().set(data) // placeholder if we use firestore. if we don't well...
    res.json({ status: 'success', data: { clothing: data } })

    console.log(`Successfully uploaded clothes`)

})

// Returns JSON (?) of all clothing items for a user
app.get('/inventory/:user_id', async (req, res) => {
    // im not even too sure if this works like this when we do authentication but we move
    res.send('GET request to get clothing')

    const user_id = req.params.user_id;
    const query = db.collection('inventory').where('user_id', '==', user_id) // placeholder for firestore PLEASEEEEE
    const querySnapshot = await query.get();
    if (querySnapshot.size > 0) {
        res.json(querySnapshot.doc[0].data());
    }
    else {
        res.json({ status: "user not found or user has no inventory" })
    }

    console.log(`Successfully returned clothes`)
})

// Returns JSON of a specific piece of clothing the user has in their inventory
app.get('/inventory/:clothing_id', async (req, res) => {
    res.send('GET request to get clothing information')

    const clothing_id = req.params.clothing_id;
    const query = db.collection('inventory').where('clothing_id', '==', clothing_id) // placeholder for firestore PLEASEEEEE
    const querySnapshot = await query.get();
    if (querySnapshot.size > 0) {
        res.json(querySnapshot.doc[0].data());
    }
    else {
        res.json({ status: "clothing not found" })
    }

    console.log(`Successfully returned clothing ite,`)
})

// Updates the data of a specific clothing from the user's inventory
app.put('/inventory/:clothing_id', (req, res) => {
    res.send('PUT request to update clothing information')

    const clothing_id = req.params.clothing_id;

    console.log(`Successfully updated clothes`)
})

// Deletes the data of a specific clothing from the user's inventory
app.delete('/inventory/:clothing_id', (req, res) => {
    res.send('DELETE request to delete an item')

    const clothing_id = req.params.clothing_id;

    console.log(`Successfully deleted clothes`)
})

// Creates an outfit based off the keyword the user sends
app.post('/inventory/shuffle/:keyword', (req, res) => {
    res.send('POST request to shuffle an outfit')

    const keyword = req.params.keyword;

    console.log(`Successfully shuffled clothes`)
})