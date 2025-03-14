const { initializeApp } = require('firebase/app')
let { getDatabase, ref, set, remove } = require('firebase/database')

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

// Deletes the data of a specific clothing from the user's inventory
app.delete('/:user_id/inventory/:clothing_id', (req, res) => {
    res.send('DELETE request to delete an item')

    // extracts user and clothing id from db
    const user_id = req.params.user_id;
    const clothing_id = req.params.clothing_id;

    // extract the location of specific item in db
    const itemRef = ref(database, `users/${user_id}/inventory/${clothing_id}`);

    // removing item from bd
    remove(itemRef)
      .then(() => {
        // data removed successfully
        console.log(`Successfully deleted clothing item!`);
      })
      .catch((error) => {
        // fails to delete
        console.error(`Error deleting clothing item`, error);
      });

})