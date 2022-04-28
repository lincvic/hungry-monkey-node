const config = require("../CONFIG")
const nodemailer = require("nodemailer")

class CommonUtil {
    parseJSON(item) {
        return JSON.parse(JSON.stringify(item))
    }

    sendEmail(email, subject, htmlContent){
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
            }else {
                console.log('Message sent: %s', info.messageId)
                return true
            }
        })
    }

    sendEmail2Manager(managerEmail, restaurantName) {
        const subject = `A new restaurant ${restaurantName} needs to be approved`
        const htmlContent = `<b>Hi:</b></br><p>A new restaurant ${restaurantName} is now waiting to join hungry monkey</p></br><b>Please Login to Hungry Monkey to check</b></br><b>Thanks</b></br><b>Hungry Monkey Team</b>`
        this.sendEmail(managerEmail, subject, htmlContent)
    }

    sendEmail2RestaurantOwner(ownerEmail){
        const subject = `A new Order has been placed`
        const htmlContent = `<b>Hi:</b></br><p>A new order has been placed</p></br><b>Please Login to Hungry Monkey to assign a driver to deliver your order</b></br><b>Thanks</b></br><b>Hungry Monkey Team</b>`
        this.sendEmail(ownerEmail, subject, htmlContent)
    }

    sendEmail2Driver(driverEmail){
        const subject = `You have been assigned to a new order`
        const htmlContent = `<b>Hi:</b></br><p>A new order has been assigned to you</p></br><b>Please Login to Hungry Monkey to check delivery details</b></br><b>Thanks</b></br><b>Hungry Monkey Team</b>`
        this.sendEmail(driverEmail, subject, htmlContent)
    }


}

module.exports = CommonUtil