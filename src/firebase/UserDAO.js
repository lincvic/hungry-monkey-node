const db = require('./firebase')
const ref = db.db.collection('Users')
const commonUtil = require('../util/common-util')
const util = new commonUtil()

class UserDAO{

    async createNewUser(User) {
        const doc = ref.doc(User.uid.toString())
        return await doc.set(util.parseJSON(User))
    }

    async getUserByUID(uid){
        const doc = ref.doc(uid.toString())
        return await doc.get()
    }

    async updateUserByUID(uid, User){
        const doc = ref.doc(uid.toString())
        return await doc.set(util.parseJSON(User))
    }

    async getUserByRole(role){
        const doc = ref.where('role', '==', role.toString())
        return await doc.get()
    }

}

module.exports = UserDAO