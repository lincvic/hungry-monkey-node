const express = require('express')
const router = express.Router()
const restDAO = require('../firebase/RestaurantDAO')
const Restaurant = require('../firebase/DTO/Restaurant')
const DAO = new restDAO()

router.post('/createNewRestaurant', (req, res) => {
    const newRest = new Restaurant(
        req.body.id,
        req.body.name,
        req.body.description,
        req.body.location,
        req.body.open_time,
        req.body.close_time,
        "WaitConfirm"
    )
    DAO.createRestaurant(newRest).then(() => {
        res.status(200).json({
            result: true,
            msg: `Restaurant ${newRest.name} created`
        })
    }).catch(err => {
        console.log(err.message)
        res.status(400).json({
            result: false,
            msg: `Restaurant ${newRest.name} create failed`
        })
    })
})

router.post('/getRestaurantByID', (req, res) => {
    const id = req.body.id
    DAO.getRestaurantByID(id).then((docSnapshot) => {
        if (docSnapshot.data()){
            res.json(docSnapshot.data())
        }else{
            res.status(400).json({
                result: false,
                msg: `Restaurant ${id} is not exist`
            })
        }

    }).catch(err => {
        console.log(err.message)
        res.status(400).json({
            result: false,
            msg: `Firebase Error`
        })
    })
})

router.post('/getRestaurantByName', (req, res) => {
    const name = req.body.name
    DAO.getRestaurantByName(name).then((docSnapshot) =>{
        if (!docSnapshot.empty){
            const docList = []
            docSnapshot.forEach((item) =>{
                docList.push(item.data())
            })
            res.json(docList)
        }else{
            res.status(400).json({
                result: false,
                msg: `Restaurant ${name} is not exist`
            })
        }
    }).catch(err => {
        console.log(err.message)
        res.status(400).json({
            result: false,
            msg: `Firebase Error`
        })
    })
})

router.post('/getAllRestaurant', (req, res) =>{
    DAO.getAllRestaurant().then((docSnapshot) =>{
        if (!docSnapshot.empty){
            const docList = []
            docSnapshot.forEach((item) =>{
                docList.push(item.data())
            })
            res.json(docList)
        }else{
            res.status(400).json({
                result: false,
                msg: `Restaurant is not empty`
            })
        }
    }).catch(err => {
        console.log(err.message)
        res.status(400).json({
            result: false,
            msg: `Firebase Error`
        })
    })
})

router.patch('/updateRestaurant', (req, res) => {
    const newRest = new Restaurant(
        req.body.id,
        req.body.name,
        req.body.description,
        req.body.location,
        req.body.open_time,
        req.body.close_time,
        req.body.status
    )
    DAO.updateRestaurantByID(req.body.id, newRest).then(() => {
        res.status(200).json({
            result: true,
            msg: `Restaurant ${newRest.name} updated`
        })
    }).catch(err => {
        console.log(err.message)
        res.status(400).json({
            result: false,
            msg: `Restaurant ${newRest.name} update failed`
        })
    })
})




module.exports = router