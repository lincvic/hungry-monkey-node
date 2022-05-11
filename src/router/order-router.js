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
    const user_uid = req.body.user_uid
    const restaurant_name = req.body.restaurant_name
    const food_ordered = req.body.food_ordered
    const order_placed_time = req.body.order_placed_time
    const order_price = req.body.order_price

    if (!user_uid ||
        !restaurant_name ||
        !food_ordered ||
        !order_placed_time ||
        !order_price
    ) {
        console.log(`Input error`)
        res.status(400).json({
            result: false,
            msg: `Input error`
        })
    } else {
        userDAO.getUserByUID(user_uid).then((it) => {
            const user = util.parseJSON(it.data())
            restDAO.getRestaurantByName(restaurant_name).then((restData) => {
                let restList = []
                restData.forEach((item) => {
                    restList.push(item.data())
                })
                const rest = util.parseJSON(restList[0])
                const newOrder = new Order(
                    uuid.v4(),
                    user_uid,
                    user.email,
                    restaurant_name,
                    food_ordered,
                    "placed",
                    order_placed_time,
                    "",
                    "",
                    order_price,
                    rest.location,
                    user.postcode
                )
                DAO.placeNewOrder(newOrder).then(() => {
                    if (config.notificationStatus) {
                        restDAO.getRestaurantByName(newOrder.restaurant_name).then((it) => {
                            const list = []
                            it.forEach((doc) => {
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
            }).catch((err) => {
                console.log(err.message)
                res.status(400).json({
                    result: false,
                    msg: `Firebase err`
                })
            })
        }).catch((err) => {
            console.log(err.message)
            res.status(400).json({
                result: false,
                msg: `Firebase err`
            })
        })
    }

})

router.post('/getOrderByRestaurantName', (req, res) => {

        const restName = req.body.restaurant_name
        if (!restName) {
            console.log(`Input error`)
            res.status(400).json({
                result: false,
                msg: `Input error`
            })
        } else {
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

    }
)

router.post('/getOrderByRestaurantNameAndStatus', (req, res) => {
        const restName = req.body.restaurant_name
        const status = req.body.order_status
        if (!restName || !status) {
            console.log(`Input error`)
            res.status(400).json({
                result: false,
                msg: `Input error`
            })
        } else {
            DAO.getOrderByRestaurantNameAndStatus(restName, status).then((docSnapshot) => {
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

    }
)

router.post('/getOrderByUserUID', (req, res) => {
        const uid = req.body.uid
        if (!uid) {
            console.log(`Input error`)
            res.status(400).json({
                result: false,
                msg: `Input error`
            })
        } else {
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
    }
)

router.post('/getOrderByDeliverEmail', (req, res) => {
        const email = req.body.order_deliver_by
        if (!email) {
            console.log(`Input error`)
            res.status(400).json({
                result: false,
                msg: `Input error`
            })
        } else {
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

    }
)

router.patch("/updateOrderStatus", (req, res) => {
    const orderID = req.body.order_id
    const status = req.body.order_status
    if (!orderID || !status) {
        console.log(`Input error`)
        res.status(400).json({
            result: false,
            msg: `Input error`
        })
    } else {
        DAO.updateOrderStatus(orderID, status).then(() => {
            res.status(200).json({
                result: true,
                msg: `Order ${orderID} updated to status ${status}`
            })
        }).catch((err) => {
            console.log(err.message)
            res.status(400).json({
                result: true,
                msg: `Order ${orderID} updated failed`
            })
        })
    }

})

router.patch("/assignOrder2Deliver", (req, res) => {
    const orderID = req.body.order_id
    const deliverEmail = req.body.order_deliver_by
    if (!orderID || !deliverEmail) {
        console.log(`Input error`)
        res.status(400).json({
            result: false,
            msg: `Input error`
        })
    } else {
        DAO.assignOrderDeliver(orderID, deliverEmail).then(() => {
            DAO.updateOrderStatus(orderID, "delivering").then(() => {
                if (config.notificationStatus) {
                    util.sendEmail2Driver(deliverEmail)
                }
                res.status(200).json({
                    result: true,
                    msg: `Order ${orderID} assign to ${deliverEmail}`
                })
            }).catch((err) => {
                console.log(err.message)
                res.status(400).json({
                    result: true,
                    msg: `Order ${orderID} updated failed`
                })
            })
        }).catch((err) => {
            console.log(err.message)
            res.status(400).json({
                result: true,
                msg: `Order ${orderID} assign failed`
            })
        })
    }
})

module.exports = router