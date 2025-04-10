const express = require('express')
let { getDatabase, ref, set, remove } = require('firebase/database')
let { connectFirebase } = require('../config/connect_firebase.js')


const delete_clothing = express.Router();

delete_clothing.use(express.json()) // sends json data to PostMan



// Initialize Firebase
connectFirebase()
// Initialize Realtime Database and get a reference to the service
const database = getDatabase();


// Deletes the data of a specific clothing from the user's inventory
delete_clothing.delete('/:user_id/clothing/:category/:clothing_id', (req, res) => {
  console.log('DELETE request to delete an item')

  // extracts user id, catgeory, and clothing id from db
  const user_id = req.params.user_id;
  const clothing_id = req.params.clothing_id;
  const category = req.params.category;

  // extract the location of specific item in db
  const itemRef = ref(database, `${user_id}/clothing/${category}/${clothing_id}`);

  // removing item from bd
  remove(itemRef)
    .then(() => {
      // data removed successfully
      res.status(200).send({ message: "Delete successful" })
      console.log(`Successfully deleted clothing item!`);
    })
    .catch((error) => {
      // fails to delete
      console.error(`Error deleting clothing item`, error);
      res.status(500).send(`Failed to delete clothing item.`);
    });

})

module.exports = delete_clothing