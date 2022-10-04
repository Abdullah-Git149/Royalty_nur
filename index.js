const express = require("express")
const app = express()
const mongoose = require("mongoose")
const dotenv = require("dotenv")
const cors = require('cors')
const bodyParser = require('body-parser')
const userRouter = require("./router/userRoute")
const documentRouter = require("./router/documentRouter")
const hospitalRouter = require("./router/hospitalRouter")
const timeRouter = require("./router/timeRouter")
const cardRouter = require("./router/cardRouter")
const path = require('path')
const Content = require("./model/Content")

const PUBLISH_KEY = "pk_test_51LSwu1DKr0UspUV1ALQTn3SHha0YAsjfYoVRoeBTaW1Hkg0C4J0zcJMTGC8dUPfNrgmPZguENDlS2NBUwvUOGVES00nNxDUQAw"
const SECRET_KEY = "sk_test_51LSwu1DKr0UspUV1aWHcxUwzYxhzZga9n5K0WsnIlEUArBtGZFMoGMwL8fT6mm8FoabHsVUcpUsJAOd1Z5eF9UjD00Bt8xB1Fb"

const stripe = require("stripe")(SECRET_KEY)


// View Engine Setup
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'ejs')
app.use(cors());


app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json());


app.use(userRouter)
app.use(hospitalRouter)
app.use(documentRouter)
app.use(timeRouter)
app.use(cardRouter)

app.use('/upload', express.static('upload')); 
app.use(express.json())



const PORT = process.env.PORT || 3015

dotenv.config()

const contentSeeder = [
    {
        title: "Privacy Policy",
        content: "This is privacy policy.",
        type: "privacy_policy"
    },
    {
        title: "Terms and Conditions",
        content: "This is terms and conditions.",
        type: "terms_and_conditions"
    }
];
const dbSeed = async () => {
    await Content.deleteMany({});
    await Content.insertMany(contentSeeder);
}
dbSeed().then(() => {
    // mongoose.connection.close();
})
mongoose.connect(
    process.env.DB, {
    useUnifiedTopology: true,
    useNewUrlParser: true,
},
    () => console.log("DB Connected")
);


app.get("/", (req, res) => {
    res.render('Home', {
        key: PUBLISH_KEY
    })
})

app.post("/payment", (req, res) => {
    stripe.customers.create({
        email: req.body.stripeEmail,
        source: req.body.stripeToken,
        name: 'Abdullah Amjad',
        address: {
            line1: '23 Valley Karachi',
            postal_code: '112233',
            city: 'karachi',
            state: 'sindh',
            country: 'Pakistan'
        }
    }).then((customer) => {
        return stripe.charges.create({
            amount: 7000,
            description: 'Web Development Pay',
            currency: 'USD',
            customer: customer.id
        })
    }).then((charge) => {
        console.log(charge);
        res.send(charge)
    }).catch((err) => {
        res.send(err.message)
    })
})

app.listen(PORT, (req, res) => {
    console.log(`Connection running on ${PORT}`);
})
