const express = require('express')
const router = express.Router()
const menuDAOClass = require('../firebase/MenuDAO')
const restDAOClass = require('../firebase/RestaurantDAO')
const orderDAOClass = require('../firebase/OrderDAO')
const DAO = new menuDAOClass()
const restaurantDAO = new restDAOClass()
const orderDAO = new orderDAOClass()
const Food = require('../firebase/DTO/Food')
const commonUtil = require('../util/common-util')
const util = new commonUtil()
const uuid = require('uuid')
const config = require("../CONFIG")

router.post('/createNewFood', (req, res) => {
    const restID = req.body.restaurant_id
    if (!restID ||
        !req.body.food_name ||
        !req.body.food_price ||
        !req.body.food_description ||
        !req.body.food_type
    ) {
        console.log(`Input error`)
        res.status(400).json({
            result: false,
            msg: `Input error`
        })
    } else {
        DAO.checkFoodNameExist(restID, req.body.food_name).then((it) => {
            if (it.empty) {
                restaurantDAO.getRestaurantByID(restID).then((docSnapshot) => {
                    const restName = util.parseJSON(docSnapshot.data())
                    const newFood = new Food(
                        uuid.v4(),
                        req.body.food_name,
                        req.body.food_price,
                        req.body.food_description,
                        restName.name,
                        req.body.food_type
                    )
                    DAO.addNewFood(restID, newFood).then(() => {
                        res.status(200).json({
                            result: true,
                            msg: `Food ${newFood.food_name} added to menu`
                        })
                    }).catch(err => {
                        console.log(err.message)
                        res.status(400).json({
                            result: false,
                            msg: `Food ${newFood.food_name} added failed`
                        })
                    })
                }).catch(() => {
                    res.status(400).json({
                        result: false,
                        msg: `Restaurant ${restID} not found`
                    })
                })
            } else {
                res.status(400).json({
                    result: false,
                    msg: `Food ${req.body.food_name} already exist`
                })
            }
        })
    }

})

router.patch('/updateFood', (req, res) => {

    const restID = req.body.restaurant_id
    if (!restID) {
        console.log(`Input error`)
        res.status(400).json({
            result: false,
            msg: `Input error`
        })
    } else {
        restaurantDAO.getRestaurantByID(restID).then((docSnapshot) => {
            const foodID = req.body.food_id
            const restaurant = util.parseJSON(docSnapshot.data())
            const newFood = new Food(
                foodID,
                req.body.food_name,
                req.body.food_price,
                req.body.food_description,
                restaurant.name,
                req.body.food_type
            )
            let oldFood = {}
            DAO.getFoodByID(restID, foodID).then((docSnapshot) => {
                oldFood = docSnapshot.data()
                DAO.updateFood(restID, newFood).then(() => {
                    res.status(200).json({
                        result: true,
                        msg: `Food ${newFood.food_name} updated`
                    })
                    if (config.notificationStatus) {
                        console.log("Sending Notification")
                        orderDAO.getOrderByRestaurantName(restaurant.name).then((orderSnapshot) => {
                            let customerList = []
                            orderSnapshot.forEach((it) => {
                                customerList.push(it.data().user_email)
                            })
                            customerList = [...new Set(customerList)]
                            try {
                                console.log("oldfood is " + oldFood.food_price)
                                console.log("newfood is " + newFood.food_price)
                                console.log("user email list : "+customerList)
                                if (parseInt(oldFood.food_price) > parseInt(newFood.food_price)
                                    && oldFood.food_name === newFood.food_name) {
                                    util.sendEmail2CustomerPriceLower(customerList, restaurant.name, newFood)
                                } else if (parseInt(oldFood.food_price) > parseInt(newFood.food_price)
                                    && oldFood.food_name !== newFood.food_name) {
                                    util.sendEmail2CustomerPriceLowerWithNameChanged(customerList, restaurant.name, oldFood, newFood)
                                } else if (parseInt(oldFood.food_price) < parseInt(newFood.food_price)
                                    && oldFood.food_name === newFood.food_name) {
                                    util.sendEmail2CustomerPriceHigher(customerList, restaurant.name, newFood)
                                } else if (parseInt(oldFood.food_price) < parseInt(newFood.food_price)
                                    && oldFood.food_name !== newFood.food_name) {
                                    util.sendEmail2CustomerPriceHigherWithNameChanged(customerList, restaurant.name, oldFood, newFood)
                                }
                            } catch (e) {
                                console.log("Something Wrong when sending email: " + e)
                            }

                        }).catch((e) => {
                            console.log("Sending Notification failed when update food during get order by restaurant name: " + e)
                        })


                    }

                }).catch(err => {
                    console.log(err.message)
                    res.status(400).json({
                        result: false,
                        msg: `Food ${newFood.food_name} update failed`
                    })
                })
            }).catch((e)=>{
                console.log(e.message)
                res.status(400).json({
                    result: false,
                    msg: `Food ${newFood.food_id} not found`
                })
            })


        }).catch(() => {
            res.status(400).json({
                result: false,
                msg: `Restaurant ${restID} not found`
            })
        })
    }
})

router.post('/getAllFoodByRestaurantID', (req, res) => {
    const restID = req.body.restaurant_id
    if (!restID) {
        console.log(`Input error`)
        res.status(400).json({
            result: false,
            msg: `Input error`
        })
    } else {
        DAO.getAllFoodByRestaurantID(restID).then((docSnapshot) => {
            if (docSnapshot) {
                const foodList = []
                docSnapshot.forEach((it) => {
                    foodList.push(it.data())
                })
                res.json(foodList)
            } else {
                res.status(400).json({
                    result: false,
                    msg: `Restaurant ${restID} not found`
                })
            }
        })
    }

})

router.delete('/deleteFood', (req, res) => {
    const restID = req.body.restaurant_id
    const foodID = req.body.food_id

    if (!restID || !foodID) {
        console.log(`Input error`)
        res.status(400).json({
            result: false,
            msg: `Input error`
        })
    } else {
        DAO.checkFoodIDExist(restID, foodID).then((docSnapshot) => {
            if (docSnapshot.data()) {
                DAO.deleteFoodByFoodID(restID, foodID).then(() => {
                    res.status(200).json({
                        result: true,
                        msg: `Restaurant ${restID} Food ${foodID} deleted`
                    })
                })
            } else {
                res.status(400).json({
                    result: false,
                    msg: `Restaurant ${restID} Food ${foodID} not found`
                })
            }
        })
    }

})

module.exports = router