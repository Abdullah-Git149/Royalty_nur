
const PUBLISH_KEY = "pk_test_51LSwu1DKr0UspUV1ALQTn3SHha0YAsjfYoVRoeBTaW1Hkg0C4J0zcJMTGC8dUPfNrgmPZguENDlS2NBUwvUOGVES00nNxDUQAw"
const SECRET_KEY = "sk_test_51LSwu1DKr0UspUV1aWHcxUwzYxhzZga9n5K0WsnIlEUArBtGZFMoGMwL8fT6mm8FoabHsVUcpUsJAOd1Z5eF9UjD00Bt8xB1Fb"

const stripe = require("stripe")(SECRET_KEY)



const User = require("../model/User")
const { Card, Transaction } = require("../model/Card")



const addCard = async (req, res) => {
    try {

        const findCard = await Card.find({ card_number: req.body.number })
        if (findCard.length > 0) {
            return res.status(400).json({ status: 0, msg: "You already added this card number" })
        } else {

            const user = await User.findOne({ _id: req.payload._id })
            const newCard = new Card
            newCard.card_number = req.body.number
            newCard.cvc = req.body.cvc
            newCard.exp_month = req.body.exp_month
            newCard.exp_year = req.body.exp_year
            newCard.userId = user._id

            await newCard.save()
            if (newCard) {
                return res.status(201).json({ status: 1, msg: "Card added successfully", Card: newCard })
            } else {

                return res.status(400).json({ status: 0, msg: "Something went wrong" })
            }

        }


    } catch (error) {

        console.log(error.message)
        return res.status(500).json({ error: error.message })
    }
}

const cardData = async (req, res) => {
    try {
        const user = await User.findOne({ _id: req.payload._id })
        if (!user) {
            return res.status(400).json({ status: 0, msg: "User not found" })
        } else {




            const card = await Card.findOne({ _id: req.body.card_id })

            if (card) {

                var param = {}
                param.card = {
                    number: card.card_number,
                    exp_month: card.exp_month,
                    exp_year: card.exp_year,
                    cvc: card.cvc
                }
                stripe.tokens.create(param, async function (err, token) {
                    if (err) {
                        console.log(err.message);
                        return res.status(500).json({ error: err.message })
                    }
                    if (token) {

                        const transaction = new Transaction

                        transaction.tokenId = token.id
                        transaction.amount = req.body.amount
                        transaction.description = req.body.description
                        transaction.cardId = card._id


                        await transaction.save()
                        if (transaction) {
                            stripe.customers.create({
                                email: req.payload.user_email,
                                source: token.id,
                                name: req.body.name,
                                address: {
                                    line1: '23 Valley Karachi',
                                    postal_code: '112233',
                                    city: 'karachi',
                                    state: 'sindh',
                                    country: 'Pakistan'
                                }
                            }).then(( ) => {
                                return stripe.charges.create({
                                    amount: req.body.amount,
                                    description: req.body.description,
                                    currency: 'USD',
                                    customer: customer.id
                                })
                            }).then((charge) => {

                                return res.status(201).json({ status: 1, msg: "Transaction created successfully" })
                            }).catch((err) => {

                                res.send("error======>" + err.message)

                            })
                        } else {
                            return res.status(400).json({ status: 0, msg: "Card not found" })
                        }

                        // return res.send(token)

                    }
                })


            } else {
                return res.status(400).json({ status: 0, msg: "Something went wrong" })
            }

        }
    } catch (error) {
        console.log(error.message)
        return res.status(500).json({ error: error.message })
    }
}


module.exports = { cardData, addCard }