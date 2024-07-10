import { initializeApp } from 'firebase/app'
import { getDatabase } from 'firebase/database'

const firebaseConfig = {
    apiKey: "AIzaSyAEz9Z93s9qaClFqVs0m3sKpJ_Ydy56P98",
    authDomain: "scoreboard-a7db7.firebaseapp.com",
    databaseURL: "https://scoreboard-a7db7-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "scoreboard-a7db7",
    storageBucket: "scoreboard-a7db7.appspot.com",
    messagingSenderId: "61388820857",
    appId: "1:61388820857:web:deabc7562eaf99ea1c1fa8"
}

// Initialize Firebase
const app = initializeApp(firebaseConfig)

// Get a reference to the database service
const database = getDatabase(app)

export { database }