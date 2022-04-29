const express = require('express')
const router = express.Router()
const orderDAO = require('../firebase/OrderDAO')
const usersDAO = require('../firebase/UserDAO')
const restDAOClass = require('../firebase/RestaurantDAO')
const Order = require('../firebase/DTO/Order')
const DAO = new orderDAO()
const userDAO = new usersDAO()
const restDAO = new restDAOClass()
const commonUtil = require('../util/common-util')
const util = new commonUtil()
const config = require('../CONFIG')
const uuid = require('uuid')

router.post('/placeNewOrder', (req, res) => {

    userDAO.getUserByUID(req.body.user_uid).then((it) => {
        const user = util.parseJSON(it.data())
        const newOrder = new Order(
            uuid.v4(),
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

        DAO.placeNewOrder(newOrder).then(() => {
            if (config.notificationStatus){
                restDAO.getRestaurantByName(newOrder.restaurant_name).then((it)=>{
                    const list = []
                    it.forEach((doc)=>{
                        list.push(doc.data())
                    })
                    const email = list[0].owner
                    console.log(`Rest ! name is ${email}`)
                    util.sendEmail2RestaurantOwner(email)
                })
            }
            res.status(200).json({
                result: true,
                msg: `Order ${newOrder.order_id} Placed`
            })
        }).catch((err) => {
            console.log(err.message)
            res.status(400).json({
                result: false,
                msg: `Order ${newOrder.order_id} Place Failed`
            })
        })
    })

})

router.post('/getOrderByRestaurantName', (req, res) => {

        const restName = req.body.restaurant_name

        DAO.getOrderByRestaurantName(restName).then((docSnapshot) => {
            const orderList = []
            docSnapshot.forEach((it) => {
                orderList.push(it.data())
            })
            res.json(orderList)
        }).catch((err) => {
            console.log(err.message)
            res.status(400).json({
                result: false,
                msg: `Restaurant ${restName} found failed`
            })
        })
    }
)

router.post('/getOrderByUserUID', (req, res) => {
        const uid = req.body.uid
        console.log(uid)
        DAO.getOrderByUserUid(uid).then((docSnapshot) => {
            const orderList = []
            docSnapshot.forEach((it) => {
                console.log(it.data())
                orderList.push(it.data())
            })
            res.json(orderList)
        }).catch((err) => {
            console.log(err.message)
            res.status(400).json({
                result: false,
                msg: `User ${uid} found failed`
            })
        })
    }
)

router.post('/getOrderByDeliverEmail', (req, res) => {
        const email = req.body.order_deliver_by
        DAO.getOrderByDeliverUID(email).then((docSnapshot) => {
            const orderList = []
            docSnapshot.forEach((it) => {
                console.log(it.data())
                orderList.push(it.data())
            })
            res.json(orderList)
        }).catch((err) => {
            console.log(err.message)
            res.status(400).json({
                result: false,
                msg: `Deliver ${email} found failed`
            })
        })
    }
)

router.patch("/updateOrderStatus", (req, res)=>{
    const orderID = req.body.order_id
    const status = req.body.order_status
    DAO.updateOrderStatus(orderID, status).then(()=>{
        res.status(200).json({
            result: true,
            msg: `Order ${orderID} updated to status ${status}`
        })
    }).catch((err)=>{
        console.log(err.message)
        res.status(400).json({
            result: true,
            msg: `Order ${orderID} updated failed`
        })
    })
})

router.patch("/assignOrder2Deliver", (req, res)=>{
    const orderID = req.body.order_id
    const deliverEmail = req.body.order_deliver_by
    DAO.assignOrderDeliver(orderID, deliverEmail).then(()=>{
        DAO.updateOrderStatus(orderID, "delivering").then(()=>{
            if (config.notificationStatus){
                util.sendEmail2Driver(deliverEmail)
            }
            res.status(200).json({
                result: true,
                msg: `Order ${orderID} assign to ${deliverEmail}`
            })
        }).catch((err)=>{
            console.log(err.message)
            res.status(400).json({
                result: true,
                msg: `Order ${orderID} updated failed`
            })
        })
    }).catch((err)=>{
        console.log(err.message)
        res.status(400).json({
            result: true,
            msg: `Order ${orderID} assign failed`
        })
    })

})

module.exports = router