const admin = require("firebase-admin");
const serviceAccount = require("./ml-shop-project-firebase-adminsdk-3ig4z-d724b5ca9f.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();
module.exports = { admin, db };
