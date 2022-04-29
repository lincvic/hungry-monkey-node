const { initializeApp, cert } = require('firebase-admin/app')
const { getFirestore } = require('firebase-admin/firestore')
const serviceAccount = require('./hungry-monkey-8888-b86260701fe7.json')
const admin = require('firebase-admin')

initializeApp({
    credential: cert(serviceAccount),
    storageBucket: "gs://hungry-monkey-8888.appspot.com"
})
const db = getFirestore()
const storage = admin.storage().bucket()
module.exports.db = db
module.exports.storage = storage