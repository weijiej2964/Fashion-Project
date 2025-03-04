// this is the main file for the api 
// TO DO: connect with firebase auth to get token to only allow authorized users to make calls

import { initializeApp } from "firebase/app";
import { getDatabase, ref, set } from "firebase/database";

const express = require('express')
// const Firestore = require('@google-cloud/firestore')
const app = express()
app.use(express.json()) // sends json data to PostMan

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyAq7_H5i_ojYQAVYVNAG8usMun5YRX0vUY",
    authDomain: "fashion-project-e2aba.firebaseapp.com",
    databaseURL: "https://fashion-project-e2aba-default-rtdb.firebaseio.com",
    projectId: "fashion-project-e2aba",
    storageBucket: "fashion-project-e2aba.firebasestorage.app",
    messagingSenderId: "156468025393",
    appId: "1:156468025393:web:72f80e880c47dca37f5d10"
};

// Initialize Firebase
const firebase = initializeApp(firebaseConfig);
// Initialize Realtime Database and get a reference to the service
const database = getDatabase(app);


const port = 3000
const server = process.env.PORT || 8080 // idk if this matters i see it everywhere tho


// stuff that comes with express brah
app.get('/', (req, res) => {
    res.send('This is our Fashion API!')
})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})

// no string patterns cause apparently they don't work on express 5 LOL
// Uploads clothing image and any data associated with it, stores it into the database
app.post('/:user_id/inventory/upload', async (req, res) => { // does this have to be async? idk lets find out 
    console.log(`POST request to upload clothes`)
    const data = {
        // need item id...
        // idea: gen random number based off of domains. keep checking if it doesn't exist and only stop if it's unique in the db for the user
        uid: user_id,
        item_id: req.body.item_id, // PLACEHOLDER for testing purposes
        item_name: req.body.clothing_name,
        item_desc: req.body.item_desc,
        image_url: req.body.image_url,
        image_blob: req.body.image_blob,
        category: req.body.category,
        tags: req.body.tags
    };

    const refPath = "/" + user_id + "/inventory/upload/"
    const userRef = firebase.database().ref(refPath)
    userRef.set(
        data,
        function (error) {
            if (error) {
                res.send("Upload unsucessful." + error)
            }
            else {
                res.send("Upload successful")
            }
        }
    );



    // await db.collection('inventory').doc().set(data) // placeholder if we use firestore. if we don't well...
    // res.json({ status: 'success', data: { clothing: data } })

    // console.log(`Successfully uploaded clothes`)

})

// Returns JSON (?) of all clothing items for a user
app.get('/:user_id/inventory/:user_id', async (req, res) => {
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
app.get('/:user_id/inventory/:clothing_id', async (req, res) => {
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
app.put('/:user_id/inventory/:clothing_id', (req, res) => {
    res.send('PUT request to update clothing information')

    const clothing_id = req.params.clothing_id;

    console.log(`Successfully updated clothes`)
})

// Deletes the data of a specific clothing from the user's inventory
app.delete('/:user_id/inventory/:clothing_id', (req, res) => {
    res.send('DELETE request to delete an item')

    const clothing_id = req.params.clothing_id;

    console.log(`Successfully deleted clothes`)
})

// Creates an outfit based off the keyword the user sends
app.post('/:user_id/inventory/shuffle/:keyword', (req, res) => {
    res.send('POST request to shuffle an outfit')

    const keyword = req.params.keyword;

    console.log(`Successfully shuffled clothes`)
})