// this is the main file for the api 
// TO DO: connect with firebase auth to get token to only allow authorized users to make calls

const { initializeApp } = require('firebase/app')
let { getDatabase, ref, set } = require('firebase/database')

const express = require('express')
const app = express()
const firebase = require('firebase/app')

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
firebase.initializeApp(firebaseConfig);
// Initialize Realtime Database and get a reference to the service
const database = getDatabase();


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

// TO DO: generate random number for item_id
// TO DO: Take care of Firebase warning errors
// TO DO: MORE ERROR HANDLING... make sure category is actually a category
app.post('/:user_id/inventory/upload', async (req, res) => { // does this have to be async? idk lets find out 
    // im not even too sure if this works like this when we do authentication but we move
    const Category = new Set(['tops', 'bottoms', 'shoes', 'hats', 'glasses', 'earrings', 'necklaces', 'bracelets', 'watches', 'rings'])


    console.log(`POST request to upload clothes`)
    try {
        item_id = req.body.item_id
        // category = (req.body.category).toLowerCase()

        // if (!Category.has(category)) {
        //     throw "Given category is not valid"
        // }

        const data = {
            uid: req.params.user_id,
            item_id: item_id, // PLACEHOLDER for testing purposes
            item_name: req.body.item_name,
            item_desc: req.body.item_desc,
            image_url: req.body.image_url,
            image_blob: req.body.image_blob,
            category: req.body.category,
            tags: req.body.tags
        };

        const refPath = "/" + req.params.user_id + "/clothing/" + req.body.category + "/" + item_id + "/"
        set(ref(database, refPath), data);


    }
    catch (err) {
        res.send("Upload unsucessful. " + err)
    }
    res.send("Upload successful")

})

// // Returns JSON (?) of all clothing items for a user
// app.get('/:user_id/inventory/', async (req, res) => {
//     // im not even too sure if this works like this when we do authentication but we move
//     res.send('GET request to get clothing')

//     const user_id = req.params.user_id;
//     const query = db.collection('inventory').where('user_id', '==', user_id) // placeholder for firestore PLEASEEEEE
//     const querySnapshot = await query.get();
//     if (querySnapshot.size > 0) {
//         res.json(querySnapshot.doc[0].data());
//     }
//     else {
//         res.json({ status: "user not found or user has no inventory" })
//     }

//     console.log(`Successfully returned clothes`)
// })

// // Returns JSON of a specific piece of clothing the user has in their inventory
// app.get('/:user_id/inventory/:clothing_id', async (req, res) => {
//     res.send('GET request to get clothing information')

//     const clothing_id = req.params.clothing_id;
//     const query = db.collection('inventory').where('clothing_id', '==', clothing_id) // placeholder for firestore PLEASEEEEE
//     const querySnapshot = await query.get();
//     if (querySnapshot.size > 0) {
//         res.json(querySnapshot.doc[0].data());
//     }
//     else {
//         res.json({ status: "clothing not found" })
//     }

//     console.log(`Successfully returned clothing ite,`)
// })

// // Updates the data of a specific clothing from the user's inventory
// app.put('/:user_id/inventory/:clothing_id', (req, res) => {
//     res.send('PUT request to update clothing information')

//     const clothing_id = req.params.clothing_id;

//     console.log(`Successfully updated clothes`)
// })

// // Deletes the data of a specific clothing from the user's inventory
// app.delete('/:user_id/inventory/:clothing_id', (req, res) => {
//     res.send('DELETE request to delete an item')

//     const clothing_id = req.params.clothing_id;

//     console.log(`Successfully deleted clothes`)
// })

// // Creates an outfit based off the keyword the user sends
// app.post('/:user_id/inventory/shuffle/:keyword', (req, res) => {
//     res.send('POST request to shuffle an outfit')

//     const keyword = req.params.keyword;

//     console.log(`Successfully shuffled clothes`)
// })