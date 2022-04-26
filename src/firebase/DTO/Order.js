class Order{
    constructor(order_id, user_uid, user_email, restaurant_name, food_ordered, order_status, order_placed_time, order_delivered_time, order_deliver_by, order_price) {
        this.order_id = order_id
        this.user_uid = user_uid
        this.user_email = user_email
        this.restaurant_name = restaurant_name
        this.food_ordered = food_ordered
        this.order_status = order_status
        this.order_placed_time = order_placed_time
        this.order_delivered_time = order_delivered_time ? order_delivered_time : ""
        this.order_deliver_by = order_deliver_by
        this.order_price = order_price
    }
}

module.exports = Order