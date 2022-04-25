const { initializeApp, applicationDefault, cert } = require('firebase-admin/app')
const { getFirestore, Timestamp, FieldValue } = require('firebase-admin/firestore')
const serviceAccount = require('./hungry-monkey-8888-b86260701fe7.json')

initializeApp({
    credential: cert(serviceAccount)
})
const db = getFirestore()
module.exports = db