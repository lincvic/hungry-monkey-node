const express = require('express')
const router = express.Router()
const menuDAO = require('../firebase/MenuDAO')
const restDAO = require('../firebase/RestaurantDAO')
const Food = require('../firebase/DTO/Food')
const DAO = new menuDAO()
const restaurantDAO = new restDAO()
const commonUtil = require('../util/common-util')
const util = new commonUtil()
const uuid = require('uuid')

router.post('/createNewFood', (req, res) => {
    const restID = req.body.restaurant_id
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
})

router.patch('/updateFood', (req, res) => {

    const restID = req.body.restaurant_id

    restaurantDAO.getRestaurantByID(restID).then((docSnapshot) => {
        const restName = util.parseJSON(docSnapshot.data())
        const newFood = new Food(
            req.body.food_id,
            req.body.food_name,
            req.body.food_price,
            req.body.food_description,
            restName.name,
            req.body.food_type
        )

        DAO.updateFood(restID, newFood).then(() => {
            res.status(200).json({
                result: true,
                msg: `Food ${newFood.food_name} updated`
            })
        }).catch(err => {
            console.log(err.message)
            res.status(400).json({
                result: false,
                msg: `Food ${newFood.food_name} update failed`
            })
        })
    }).catch(() => {
        res.status(400).json({
            result: false,
            msg: `Restaurant ${restID} not found`
        })
    })
})

router.post('/getAllFoodByRestaurantID', (req, res)=>{
    const restID = req.body.restaurant_id
    DAO.getAllFoodByRestaurantID(restID).then((docSnapshot) =>{
        if(docSnapshot){
            const foodList = []
            docSnapshot.forEach((it)=>{
                foodList.push(it.data())
            })
            res.json(foodList)
        }else {
            res.status(400).json({
                result: false,
                msg: `Restaurant ${restID} not found`
            })
        }
    })
})

router.delete('/deleteFood', (req,res)=>{
    const restID = req.body.restaurant_id
    const foodID = req.body.food_id

    DAO.checkFoodIDExist(restID, foodID).then((docSnapshot)=>{
        if(docSnapshot.data()){
            DAO.deleteFoodByFoodID(restID, foodID).then(()=>{
                    res.status(200).json({
                        result: true,
                        msg: `Restaurant ${restID} Food ${foodID} deleted`
                    })
            })
        }else {
            res.status(400).json({
                result: false,
                msg: `Restaurant ${restID} Food ${foodID} not found`
            })
        }
    })


})

module.exports = router