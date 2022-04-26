const db = require('./firebase')
const ref = db.collection('Orders')
const commonUtil = require('../util/common-util')
const util = new commonUtil()

class OrderDAO{
    async placeNewOrder(order){
        const doc = ref.doc(order.order_id.toString())
        return await doc.set(util.parseJSON(order))
    }

    async getOrderByRestaurantID(restID){

    }
}

module.exports = OrderDAO