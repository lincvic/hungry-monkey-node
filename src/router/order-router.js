const express = require('express')
const router = express.Router()
const restDAO = require('../firebase/OrderDAO')
const usersDAO = require('../firebase/UserDAO')
const Order = require('../firebase/DTO/Order')
const DAO = new restDAO()
const userDAO = new usersDAO()
const commonUtil = require('../util/common-util')
const util = new commonUtil()

router.post('/placeNewOrder', (req, res)=>{

    userDAO.getUserByUID(req.body.user_uid).then((it)=>{
        const user = util.parseJSON(it.data())
        const newOrder = new Order(
            req.body.order_id,
            req.body.user_uid,
            user.email,
            req.body.restaurant_name,
            req.body.food_ordered,
            "placed",
            req.body.order_placed_time,
            "",
            "",
            req.body.order_price
        )

        DAO.placeNewOrder(newOrder).then(()=>{
            res.status(200).json({
                result: true,
                msg: `Order ${newOrder.order_id} Placed`
            })
        }).catch((err)=>{
            console.log(err.message)
            res.status(400).json({
                result: false,
                msg: `Order ${newOrder.order_id} Place Failed`
            })
        })
    })

})

module.exports = router