const express = require('express')
const router = express.Router()
const restDAO = require('../firebase/RestaurantDAO')
const Restaurant = require('../firebase/DTO/Restaurant')
const DAO = new restDAO()

router.post('/createNewRestaurant', (req, res) => {
    const newRest = new Restaurant(
        req.body.restaurant_id,
        req.body.name,
        req.body.description,
        req.body.location,
        req.body.open_time,
        req.body.close_time,
        "WaitConfirm",
        req.body.owner
    )

    DAO.checkRestaurantNameExist(newRest.name).then((it)=>{
        if (it.empty){
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
        }else{
            res.status(400).json({
                result: false,
                msg: `Restaurant ${newRest.name} already exist`
            })
        }
    })

})

router.post('/getRestaurantByID', (req, res) => {
    const id = req.body.restaurant_id
    DAO.getRestaurantByID(id).then((docSnapshot) => {
        if (docSnapshot.data()){
            console.log(docSnapshot.data())
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

router.get('/getAllRestaurant', (req, res) =>{
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
                msg: `Restaurant is empty`
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
        req.body.restaurant_id,
        req.body.name,
        req.body.description,
        req.body.location,
        req.body.open_time,
        req.body.close_time,
        req.body.status,
        req.body.owner
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

router.patch("/updateRestaurantStatus", (req, res)=>{
    const restID = req.body.restaurant_id
    const status = req.body.status
    DAO.updateRestaurantStatus(restID, status).then(()=>{
        res.status(200).json({
            result: true,
            msg: `Restaurant ${restID} updated to status ${status}`
        })
    }).catch((err)=>{
        console.log(err.message)
        res.status(400).json({
            result: true,
            msg: `Restaurant ${restID} updated failed`
        })
    })
})

router.post('/getAllRestaurantByStatus', (req, res) =>{
    const status = req.body.status
    DAO.getAllRestaurantByStatus(status).then((docSnapshot) =>{
        if (!docSnapshot.empty){
            const docList = []
            docSnapshot.forEach((item) =>{
                docList.push(item.data())
            })
            res.json(docList)
        }else{
            res.status(400).json({
                result: false,
                msg: `Restaurant is empty`
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




module.exports = router