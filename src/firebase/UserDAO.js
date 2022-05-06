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

    async updateUserVerificationStatus(uid, status){
        const doc = ref.doc(uid.toString())
        return await doc.update({status: status.toString()})
    }

    async getUserByEmail(email){
        const doc = ref.where('email', '==', email.toString())
        return await doc.get()
    }


    async getUserByRole(role){
        const doc = ref.where('role', '==', role.toString())
        return await doc.get()
    }

    async updateDriverStatusByUID(uid, status){
        const doc = ref.doc(uid.toString())
        return await doc.update({deliver_status: status.toString()})
    }

}

module.exports = UserDAO