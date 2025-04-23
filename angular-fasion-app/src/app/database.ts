
import { initializeApp } from "firebase/app";
import { getDatabase,ref,set } from "firebase/database";
const firebaseConfig = {
  // ...
  // The value of `databaseURL` depends on the location of the database
  databaseURL: "https://fashion-project-e2aba-default-rtdb.firebaseio.com/:null",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// Initialize Realtime Database and get a reference to the service
const database = getDatabase(app);

// function writeUserData(uid, name, email, imageUrl) {
//   set(ref(database, 'users/' + uid), {
//     username: name,
//     email: email,
//     profile_picture : imageUrl
//   });
//}
type Category = 'Tops' | 'Bottoms' | 'Shoes' | 'Hats' | 'Glasses' | 'Earrings' | 'Necklaces' | 'Bracelets' | 'Watches' | 'Rings';
function addClothes(itemID: number, uid: number, itemName: string, itemDesc: string, image_url: string, imageBase64: string, category: Category) {
  set(ref(database, 'Clothes/' + itemID), {
    UID: uid,
    Item_Name: itemName,
    Item_Desc: itemDesc,
    Image_url: image_url,
    Image_Base64:imageBase64,
    Category: category
  });
}
  // Function to add outfits data
function addOutfit(outfitID: number, outfitName: string, items: { [key: string]: boolean }) {
  set(ref(database, 'Outfits/' + outfitID), {
    Outfit_Name: outfitName,
    Items: items
  });
}