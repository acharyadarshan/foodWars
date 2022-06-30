const admin = require("firebase-admin");

const serviceAccount = require("./serviceAcount.json");

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
});
const db = admin.firestore();
const gameState = db.collection("data");
module.exports = gameState;
