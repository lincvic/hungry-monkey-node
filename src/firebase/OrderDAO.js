const db = require('./firebase')
const ref = db.db.collection('Orders')
const commonUtil = require('../util/common-util')
const util = new commonUtil()

class OrderDAO{
    async placeNewOrder(order){
        const doc = ref.doc(order.order_id.toString())
        return await doc.set(util.parseJSON(order))
    }

    async getOrderByRestaurantName(restName){
        const doc = ref.where('restaurant_name', '==', restName.toString())
        return await doc.get()
    }

    async getOrderByUserUid(uid){
        const doc = ref.where('user_uid', '==', uid.toString())
        return await doc.get()
    }

    async getOrderByDeliverUID(uid){
        const doc = ref.where('order_deliver_by', '==', uid.toString())
        return await doc.get()
    }

    async updateOrderStatus(orderID, status){
        const doc = ref.doc(orderID.toString())
        return await doc.update({order_status: status.toString()})
    }

    async assignOrderDeliver(orderID, deliverEmail){
        const doc = ref.doc(orderID.toString())
        return await doc.update({order_deliver_by: deliverEmail.toString()})
    }



}

module.exports = OrderDAO