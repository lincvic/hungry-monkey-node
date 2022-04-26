const express = require('express')
const router = express.Router()
const menuDAO = require('../firebase/MenuDAO')
const restDAO = require('../firebase/RestaurantDAO')
const Food = require('../firebase/DTO/Food')
const DAO = new menuDAO()
const restaurantDAO = new restDAO()
const commonUtil = require('../util/common-util')
const util = new commonUtil()

router.post('/createNewFood', (req, res) => {
    const restID = req.body.id
    DAO.checkFoodNameExist(restID, req.body.food_name).then((it)=>{
        if (it.empty){
            restaurantDAO.getRestaurantByID(restID).then((docSnapshot) => {
                const restName = util.parseJSON(docSnapshot.data())
                const newFood = new Food(
                    req.body.food_id,
                    req.body.food_name,
                    req.body.food_description,
                    restName.name
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
            })
        }else {
            res.status(400).json({
                result: false,
                msg: `Food ${req.body.food_name} already exist`
            })
        }
    })
})

module.exports = router