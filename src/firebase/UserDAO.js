const db = require('./firebase')
const userRef = db.collection('Users')
const commonUtil = require('../util/commonUtil')
const util = new commonUtil()

class UserDAO{

    async createNewUser(User) {
        const doc = userRef.doc(User.uid.toString())
        return await doc.set(util.parseJSON(User))
    }

    async getUserByUID(uid){
        const doc = userRef.doc(uid.toString())
        return await doc.get()
    }

    async updateUserByUID(uid, User){
        const doc = userRef.doc(uid.toString())
        return await doc.set(util.parseJSON(User))
    }
}

module.exports = UserDAO