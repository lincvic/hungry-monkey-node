const db = require('./firebase')
const reference = db.db.collection('Restaurants')
const commonUtil = require('../util/common-util')
const util = new commonUtil()
const {ref, getDownloadURL } = require('firebase-admin/storage')


class RestaurantDAO{

    async checkRestaurantNameExist(name) {
        const doc = reference.where('name', '==', name.toString())
        return await doc.get()
    }

    async checkRestaurantIDExist(id){
        const doc = reference.where('restaurant_id', '==', id.toString())
        return await doc.get()
    }

    async createRestaurant(Rest){
        const doc = reference.doc(Rest.restaurant_id.toString())
        return await doc.set(util.parseJSON(Rest))
    }

    async getRestaurantByID(id){
        const doc = reference.doc(id.toString())
        return await doc.get()
    }

    async getRestaurantByName(name){
        const doc = reference.where('name', '==', name.toString())
        return await doc.get()
    }

    async getAllRestaurant(){
        return await reference.get()
    }

    async updateRestaurantByID(id, Rest){
        console.log("update id is "+id)
        const doc = reference.doc(id.toString())
        return await doc.set(util.parseJSON(Rest))
    }

    async updateRestaurantStatus(id, status){
        const doc = reference.doc(id.toString())
        return await doc.update({status: status.toString()})
    }

    async getAllRestaurantByStatus(status){
        return await reference.where('status', '==', status.toString()).get()
    }

    async getRestaurantImage(restID) {
        const filename = `RestaurantImage/${restID}.png`
        console.log(filename)
        const options = {
            version: 'v2',
            action: 'read',
            expires: Date.now() + 1000 * 60 * 60
        }

        return  await db.storage.file(filename).getSignedUrl(options)
    }

}

module.exports = RestaurantDAO