const db = require('./firebase')
const ref = db.collection('Restaurants')
const commonUtil = require('../util/common-util')
const util = new commonUtil()

class RestaurantDAO{

    async checkRestaurantNameExist(name) {
        const doc = ref.where('name', '==', name.toString())
        return await doc.get()
    }

    async createRestaurant(Rest){
        const doc = ref.doc(Rest.id.toString())
        return await doc.set(util.parseJSON(Rest))
    }

    async getRestaurantByID(id){
        const doc = ref.doc(id.toString())
        return await doc.get()
    }

    async getRestaurantByName(name){
        const doc = ref.where('name', '==', name.toString())
        return await doc.get()
    }

    async getAllRestaurant(){
        return await ref.get()
    }

    async updateRestaurantByID(id, Rest){
        const doc = ref.doc(id.toString())
        return await doc.set(util.parseJSON(Rest))
    }

}

module.exports = RestaurantDAO