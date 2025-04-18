const { initializeApp } = require('firebase/app')

// put some error handling here OMG...
const connectFirebase = async () => {
    const firebase = require('firebase/app')

    const firebaseConfig = {
        apiKey: "AIzaSyAq7_H5i_ojYQAVYVNAG8usMun5YRX0vUY",
        authDomain: "fashion-project-e2aba.firebaseapp.com",
        databaseURL: "https://fashion-project-e2aba-default-rtdb.firebaseio.com",
        projectId: "fashion-project-e2aba",
        storageBucket: "fashion-project-e2aba.firebasestorage.app",
        messagingSenderId: "156468025393",
        appId: "1:156468025393:web:72f80e880c47dca37f5d10"
    };
    firebase.initializeApp(firebaseConfig);

}

module.exports = { connectFirebase }