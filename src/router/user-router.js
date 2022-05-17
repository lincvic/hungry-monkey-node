const express = require('express')
const router = express.Router()
const userDAO = require('../firebase/UserDAO')
const User = require('../firebase/DTO/User')
const DAO = new userDAO()
const utilClass = require("../util/common-util")
const util = new utilClass()

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
        const status = req.body.status ? req.body.status : "unconfirmed"
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
                    req.body.postcode,
                    status
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
            req.body.postcode,
            req.body.status
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

router.patch("/updateDriverStatusByUID", (req, res) =>{
    const uid = req.body.uid
    const status = req.body.deliver_status
    if (!uid || !status){
        console.log(`Input error`)
        res.status(400).json({
            result: false,
            msg: `Input error`
        })
    }else {
        DAO.updateDriverStatusByUID(uid, status).then(()=>{
            res.status(200).json({
                result: true,
                msg: `User ${uid} status updated to ${status}`
            })
        }).catch((e)=>{
            console.log(e.message)
            res.status(400).json({
                result: false,
                msg: `Firebase error`
            })
        })
    }
})

router.get("/confirmEmail", (req, res) =>{
    const encUID = req.query.uid
    const encIV = req.query.key
    const hash = {
        iv: encIV,
        content: encUID
    }
    try {
        const uid = util.decrypt(hash)
        console.log(`Decrypted UID is ${uid}`)
        const status = "confirmed"
        if (!uid || !status){
            console.log(`Input error`)
            res.status(400).json({
                result: false,
                msg: `Input error`
            })
        }else{
            DAO.updateUserVerificationStatus(uid, status).then(()=>{
                res.status(200).json({
                    result: true,
                    msg: `User ${uid} email confirmed`
                })
            }).catch((e)=>{
                console.log(e.message)
                res.status(400).json({
                    result: false,
                    msg: `DO NOT MODIFY THE CONTENT OF LINK`
                })
            })
        }
    }catch (e){
        console.log(e.message)
        return res.status(400).json({
            result: false,
            msg: `DO NOT MODIFY THE CONTENT OF LINK`
        })
    }
})

router.post("/verifyEmail", (req, res) =>{
    const email = req.body.email
    const uid = req.body.uid
    if (!email|| !uid){
        console.log(`Input error`)
        res.status(400).json({
            result: false,
            msg: `Input error`
        })
    }else {
        util.sendVerificationEmail(email, uid)
        res.status(200).json({
            result: true,
            msg: `Email sent to ${email}`
        })
    }
})

router.post('/checkUserStatus', (req, res)=>{
    const email = req.body.email
    if (!email){
        console.log(`checkUserStatus Input error`)
        res.status(400).json({
            result: false,
            msg: `Input error`
        })
    }else{
        DAO.getUserByEmail(email).then((it)=>{
            const userList = []
            it.forEach((doc)=>{
                userList.push(doc.data())
            })
            console.log("User Email is "+ email)
            if (userList[0].status){
                if (userList[0].status !== "unconfirmed"){
                    res.status(200).json({
                        result: true,
                        msg: `Email verified`
                    })
                }else {
                    res.status(200).json({
                        result: false,
                        msg: `Email not verified`
                    })
                }
            }else {
                res.status(400).json({
                    result: false,
                    msg: `Input error`
                })
            }
        }).catch((e)=>{
            console.log(e.message)
            res.status(400).json({
                result: false,
                msg: `Firebase error`
            })
        })
    }
})


module.exports = router