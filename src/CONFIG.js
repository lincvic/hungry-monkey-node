const CONFIG = {
    port: process.env.PORT || 8888,
    mailHost:'smtp.office365.com',
    mailService: "Outlook365", //https://nodemailer.com/smtp/well-known/
    mailPort: 587,
    mailAccount: "hungry-monkey-team@outlook.com",
    mailPSW: "Qwerty123!@#",
    managerEmail: "lincvic@yahoo.com",
    notificationStatus: false,
    KEY: "aOVH6sdmpN1jcRIqCs7rdxs01lwHzfr3"
}


module.exports= CONFIG