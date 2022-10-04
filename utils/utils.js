const nodemailer = require("nodemailer");
const multer = require("multer")
var FCM = require("fcm-node");
const User = require("../model/User")
const SERVER_fIREBASE = "AAAAFWa4sIg:APA91bHjZQ0EHiO_Fcm8NjXIkXzOlPnGgvufPikZy9GuDyaFal9bhc_uANiFawLY-EL_WDx6eRNCe3uDKvAI49kWxbtH3cQuxO04v1BZfNhvcGcU3Cfqv0Ur6ep5YPxhzTpo6XC5vJSP"


var fcm = new FCM(SERVER_fIREBASE);

// ============= NODE MAILER ============= 

var transporter = nodemailer.createTransport({
    host: "smtp.mailtrap.io",
    port: 2525,
    auth: {
        user: "458eedd80819d8",
        pass: "10d673c1a0469e"
    }
})

const sendEmail = (email, verificationCode, subject) => {
    const mailOptions = {
        from: "noreply@server.appsstaging.com",
        to: email,
        subject: subject,
        html: `<p>Your verification code is ${verificationCode} </p>`
    }
    transporter.sendMail(mailOptions, function (err, result) {
        if (err) console.log(err)
        else console.log(result);
    })
}

// ===================== MULTER =====================



const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        if (file.fieldname == "user_Image") {
            cb(null, './upload/profile/')
        } else if (file.fieldname == "aclsLicense") {
            cb(null, './upload/aclsLicense/')
        } else if (file.fieldname == "blsLicense") {
            cb(null, './upload/blsLicense/')
        } else if (file.fieldname == "cnaCertificate") {
            cb(null, './upload/cnaReport/')
        } else if (file.fieldname == "covidLicense") {
            cb(null, './upload/covidLicense/')
        } else if (file.fieldname == "covidVaccine") {
            cb(null, './upload/covidVaccine/')
        } else if (file.fieldname == "cprLicense") {
            cb(null, './upload/cprLicense/')
        } else if (file.fieldname == "driverLicense") {
            cb(null, './upload/driverLicense/')
        } else if (file.fieldname == "hepatitisLicense") {
            cb(null, './upload/hepatitisLicense/')
        } else if (file.fieldname == "nursingLicense") {
            cb(null, './upload/nursingLicense/')
        } else if (file.fieldname == "socialSecurity") {
            cb(null, './upload/socialSecurity/')
        }
    },
    filename: function (req, file, cb) {
        cb(null, new Date().toISOString().replace(/:/g, '-') + file.originalname)

    }
})

// function fileFilter(req, file, cb) {
//     cb(null, true)
//     if (file.mimetype == "image/jpeg" || file.mimetype == "image/png" || file.mimetype == "image/jfif") {
//         cb(null, true)
//     } else {
//         cb(null, false)
//     }
// }

const upload = multer({
    storage: storage,
    limits: {
        fieldSize: 1024 * 1024 * 5
    },
    // fileFilter: fileFilter
})

// ================== PUSH NOTIFICATIONS ============= 


const push_notification = async (job) => {

    const user = await User.findOne({ _id: job.user_id })
    console.log("data of paylaod", user);

    var message = {
        to: user,
        collapse_key: "your_collapse_key",
        notification: {
            title: "Royalty Nurse",
            body: "Your request has been accepted",
        },
        data: {
            job: job
        }
    }

    fcm.send(message, function (err, response) {
        if (err) {
            console.log("Something has gone wrong!", err);
        } else {
            console.log("Successfully sent with response: ", response);

        }
    })

}

module.exports = { sendEmail, upload, push_notification }