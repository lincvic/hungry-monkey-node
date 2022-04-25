const express = require('express')
const router = express.Router()
const userDAO = require('../firebase/UserDAO')
const User = require('../firebase/DTO/User')
const DAO = new userDAO()

router.post('/createUser', (req, res) => {
    const newUser = new User(req.body.uid,
        req.body.email,
        req.body.first_name,
        req.body.last_name,
        req.body.role
    )
    DAO.createNewUser(newUser).then(() => {
        res.status(200).json({
            result: true,
            msg: `User ${newUser.email} created`
        })
    }).catch(err => {
        console.log(err.message)
        res.status(400).json({
            result: false,
            msg: `User ${newUser.email} create failed`
        })
    })
})

router.post('/getUserByUID', (req, res) => {
    const uid = req.body.uid
    DAO.getUserByUID(uid).then((docSnapshot) => {
        console.log(`User ${uid} found`)
        res.json(docSnapshot.data())
    }).catch(err => {
        console.log(err.message)
        res.status(400).json({
            result: false,
            msg: `User ${uid} found failed`
        })
    })
})

router.post('/updateUserByUID', (req, res) =>{
    const uid = req.body.uid
    const newUser = new User(req.body.uid,
        req.body.email,
        req.body.first_name,
        req.body.last_name,
        req.body.role,
        req.body.address_first_line,
        req.body.address_second_line,
        req.body.city,
        req.body.country,
        req.body.postcode
    )
    DAO.updateUserByUID(uid, newUser).then(() => {
        res.status(200).json({
            result: true,
            msg: `User ${newUser.email} updated`
        })
    }).catch(err => {
        console.log(err.message)
        res.status(400).json({
            result: false,
            msg: `User ${newUser.email} update failed`
        })
    })
})



module.exports = router