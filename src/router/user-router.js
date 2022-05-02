const express = require('express')
const router = express.Router()
const userDAO = require('../firebase/UserDAO')
const User = require('../firebase/DTO/User')
const DAO = new userDAO()

router.post('/createUser', (req, res) => {
    if(!req.body.first_name||
        !req.body.last_name||
        !req.body.role||
        !req.body.uid
    ){
        console.log(`Input error`)
        res.status(400).json({
            result: false,
            msg: `Input error`
        })
    }else{
        DAO.getUserByUID(req.body.uid).then((it) =>{
            if(!it.data()){
                const newUser = new User(req.body.uid,
                    req.body.email,
                    req.body.first_name,
                    req.body.last_name,
                    req.body.role,
                    req.body.deliver_status,
                    req.body.address_first_line,
                    req.body.address_second_line,
                    req.body.city,
                    req.body.country,
                    req.body.postcode
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
            }else{
                res.status(400).json({
                    result: false,
                    msg: `User ${req.body.uid} already exist`
                })
            }
        })
    }


})

router.post('/getUserByUID', (req, res) => {
    const uid = req.body.uid
    if(!uid){
        console.log(`Input error`)
        res.status(400).json({
            result: false,
            msg: `Input error`
        })
    }else{
        DAO.getUserByUID(uid).then((docSnapshot) => {
            if (docSnapshot.data()){
                console.log(`User ${uid} found`)
                res.json(docSnapshot.data())
            }else{
                res.status(400).json({
                    result: false,
                    msg: `User ${uid} not found`
                })
            }

        }).catch(err => {
            console.log(err.message)
            res.status(400).json({
                result: false,
                msg: `User ${uid} found failed`
            })
        })
    }

})

router.patch('/updateUserByUID', (req, res) =>{
    const uid = req.body.uid
    if (!uid){
        console.log(`Input error`)
        res.status(400).json({
            result: false,
            msg: `Input error`
        })
    }else {
        const newUser = new User(req.body.uid,
            req.body.email,
            req.body.first_name,
            req.body.last_name,
            req.body.role,
            req.body.deliver_status,
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
    }

})

router.post("/getUserByRole", (req, res)=>{
    const role = req.body.role
    if(!role){
        console.log(`Input error`)
        res.status(400).json({
            result: false,
            msg: `Input error`
        })
    }else{
        DAO.getUserByRole(role).then((it)=>{
            if (!it.empty){
                const userList = []
                it.forEach((doc)=>{
                    userList.push(doc.data())
                })
                res.json(userList)
            }else{
                res.status(400).json({
                    result: false,
                    msg: `User get failed`
                })
            }

        }).catch((err)=>{
            console.log(err.message)
            res.status(400).json({
                result: false,
                msg: `User get failed`
            })
        })
    }
})



module.exports = router