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
    const clothingRef = database.ref(`users/${user_id}/clothing/${clothing_id}`); 
    const changes = req.body;
    const validCategories = [
        'Tops', 'Bottoms', 'Shoes', 'Hats',
        'Glasses', 'Earrings', 'Necklaces',
        'Bracelets', 'Watches', 'Rings'
      ];
    //clothes details
    // UID: uid,
    // Item_Name: itemName,
    // Item_Desc: itemDesc,
    // //Image_url: image_url,
    // Image_Blob: imageBlob,
    // Category: category
    //Category = 'Tops' | 'Bottoms' | 'Shoes' | 'Hats' | 'Glasses' | 'Earrings' | 'Necklaces' | 'Bracelets' | 'Watches' | 'Rings';

    if (changes.Category)
        {
            if (!validCategories.includes(updates.category)) {
                return res.status(400).send({ error: 'Invalid category value!' });
              }
        }  
    else if(changes.item_name)
        {
            if(typeof changes.item_name != 'string')
                return res.status(400).send({ error: 'Item Name must be a string!' });
        }
    else if(changes.item_desc)
        {
            if(typeof changes.item_desc != 'string')
                return res.status(400).send({ error: 'Item Description must be a string!' });
        }
    else if (changes.image_blob) 
        {
            // Check if it's a valid base64-encoded string
            if (!changes.image_blob.startsWith('data:image/')) {
              return res.status(400).send({ error: 'Invalid image format!' });
            }
        }
    clothingRef.update(changes)
    .then(() => {
      res.status(200).send({ message: 'Data updated successfully!', updatedFields: changes });
    })
    .catch(error => {
      res.status(500).send({ error: 'Failed to update data', details: error.message });
    });
    console.log(`Successfully updated clothes`);
    })