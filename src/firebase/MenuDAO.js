const db = require('./firebase')
const ref = db.db.collection('Restaurants')
const commonUtil = require('../util/common-util')
const util = new commonUtil()

class MenuDAO{

    refBuilder(restaurantID){
        return ref.doc(restaurantID.toString()).collection("Menu")
    }

    async checkFoodNameExist(restaurantID, name) {
        console.log("Checking Food Name is Exist or Not")
        const doc = this.refBuilder(restaurantID).where('food_name', '==', name.toString())
        return await doc.get()
    }

    async checkFoodIDExist(restaurantID, foodID) {
        const doc = this.refBuilder(restaurantID).doc(foodID.toString())
        return await doc.get()
    }


    async addNewFood(restaurantID, Food){
        const document = this.refBuilder(restaurantID)
        return await document.doc(Food.food_id.toString()).set(util.parseJSON(Food))
    }

    async updateFood(restaurantID, Food){
        const document = this.refBuilder(restaurantID)
        return await document.doc(Food.food_id.toString()).set(util.parseJSON(Food))
    }

    async getAllFoodByRestaurantID(restaurantID){
        const document = this.refBuilder(restaurantID)
        return await document.get()
    }

    async getFoodByID(restaurantID, foodID){
        const document = this.refBuilder(restaurantID)
        return await document.doc(foodID.toString()).get()
    }

    async deleteFoodByFoodID(restaurantID, foodID){
        const document = this.refBuilder(restaurantID)
        return await document.doc(foodID.toString()).delete()
    }

}

module.exports = MenuDAO