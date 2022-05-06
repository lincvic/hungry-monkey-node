const config = require("../CONFIG")
const nodemailer = require("nodemailer")
const crypto = require('crypto')
const algorithm = 'aes-256-ctr'
const secretKey = config.KEY
const iv = crypto.randomBytes(16)

class CommonUtil {
    parseJSON(item) {
        return JSON.parse(JSON.stringify(item))
    }

    encrypt(text) {
        const cipher = crypto.createCipheriv(algorithm, secretKey, iv)
        const encrypted = Buffer.concat([cipher.update(text), cipher.final()])
        return {
            iv: iv.toString('hex'),
            content: encrypted.toString('hex')
        }
    }

    decrypt(hash){
        const decipher = crypto.createDecipheriv(algorithm, secretKey, Buffer.from(hash.iv, 'hex'))
        const decrypted = Buffer.concat([decipher.update(Buffer.from(hash.content, 'hex')), decipher.final()])
        return decrypted.toString()
    }


    sendEmail(email, subject, htmlContent) {
        let transporter = nodemailer.createTransport({
            host: config.mailHost,
            service: config.mailService,
            port: config.mailPort,
            secureConnection: true,
            auth: {
                user: config.mailAccount,
                pass: config.mailPSW,
            }
        })
        let mailOptions = {
            from: config.mailAccount,
            to: email,
            subject: subject,
            html: htmlContent
        }

        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.log(error)
                return false
            } else {
                console.log('Message sent: %s', info.messageId)
                return true
            }
        })
    }

    linkBuilder(uid){
        const server = "https://hungry-monkey-api.azurewebsites.net/api/user/confirmEmail?uid="
        const encryptInfo = this.encrypt(uid.toString())
        return server+encryptInfo.content+"&key="+encryptInfo.iv
    }

    sendVerificationEmail(email, uid){
        const link = this.linkBuilder(uid)
        const subject = `Please Verify Your Email`
        const htmlContent = `<p>Hi:</p></br><p>Please click the link follow verify your email for Hungry-Monkey</p></br></br><a href = ${link}>Click Here To Verify</a></br></br></br><p>Thanks</p><p>Hungry Monkey Team</p>`
        //this.sendEmail(email, subject, htmlContent)
        console.log(link)
    }

    sendEmail2Manager(managerEmail, restaurantName) {
        const subject = `A new restaurant ${restaurantName} needs to be approved`
        const htmlContent = `<p>Hi:</p></br><p>A new restaurant ${restaurantName} is now waiting to join hungry monkey</p></br><b>Please Login to Hungry Monkey to check</b></br></br><p>Thanks</p><p>Hungry Monkey Team</p>`
        this.sendEmail(managerEmail, subject, htmlContent)
    }

    sendEmail2RestaurantOwner(ownerEmail) {
        const subject = `A new Order has been placed`
        const htmlContent = `<p>Hi:</p></br><p>A new order has been placed</p></br><b>Please Login to Hungry Monkey to assign a driver to deliver your order</b></br></br><p>Thanks</p><p>Hungry Monkey Team</p>`
        this.sendEmail(ownerEmail, subject, htmlContent)
    }

    sendEmail2Driver(driverEmail) {
        const subject = `You have been assigned to a new order`
        const htmlContent = `<p>Hi:</p></br><p>A new order has been assigned to you</p></br><b>Please Login to Hungry Monkey to check delivery details</b></br></br><p>Thanks</p><p>Hungry Monkey Team</p>`
        this.sendEmail(driverEmail, subject, htmlContent)
    }

    sendEmail2CustomerPriceLower(customerEmails, restaurant, food) {
        const subject = `Restaurant ${restaurant} now has an offer on ${food.food_name}`
        const htmlContent = `<p>Hi:</p></br><p>${restaurant} has a new offer!</p></br><b>The price of ${food.food_name} has been changed to £${food.food_price}</b></br></br><p>Thanks</p><p>Hungry Monkey Team</p>`
        this.sendEmail(customerEmails, subject, htmlContent)
        console.log("sendEmail2CustomerPriceLower Triggered")
    }

    sendEmail2CustomerPriceLowerWithNameChanged(customerEmails, restaurant, oldFood, newFood) {
        const subject = `Restaurant ${restaurant} now has an offer on ${newFood.food_name}`
        const htmlContent = `<p>Hi:</p></br><p>${restaurant} has a new offer!</p></br><b>The price of ${newFood.food_name} (was ${oldFood.food_name}) has been changed to £${newFood.food_price}</b></br></br><p>Thanks</p><p>Hungry Monkey Team</p>`
        this.sendEmail(customerEmails, subject, htmlContent)
        console.log("sendEmail2CustomerPriceLowerWithNameChanged Triggered")
    }

    sendEmail2CustomerPriceHigher(customerEmails, restaurant, food) {
        const subject = `Restaurant ${restaurant} has change the price of ${food.food_name}`
        const htmlContent = `<p>Hi:</p></br><p>${restaurant} has changed the price!</p></br><b>The price of ${food.food_name} has been changed to £${food.food_price}</b></br></br><p>Thanks</p><p>Hungry Monkey Team</p>`
        this.sendEmail(customerEmails, subject, htmlContent)
        console.log("sendEmail2CustomerPriceHigher Triggered")
    }

    sendEmail2CustomerPriceHigherWithNameChanged(customerEmails, restaurant, oldFood, newFood) {
        const subject = `Restaurant ${restaurant} has change the price of ${newFood.food_name}`
        const htmlContent = `<p>Hi:</p></br><p>${restaurant} has changed the price!</p></br><b>The price of ${newFood.food_name} (was ${oldFood.food_name}) has been changed to £${newFood.food_price}</b></br></br><p>Thanks</p><p>Hungry Monkey Team</p>`
        this.sendEmail(customerEmails, subject, htmlContent)
        console.log("sendEmail2CustomerPriceHigherWithNameChanged Triggered")

    }


}

module.exports = CommonUtil