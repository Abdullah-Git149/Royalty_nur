const mongoose = require("mongoose")


const cardSchema = mongoose.Schema({
    // email: {
    //     type: String,
    //     trim: true,
    //     default: null
    // },
    card_number: {
        type: Number,
        trim: true,
        default: null
    },
    exp_month: {
        type: String,
        trim: true,
        default: null
    },
    exp_year: {
        type: String,
        trim: true,
        default: null
    },
    cvc: {

        type: String,
        trim: true,

    },
    // amount: {
    //     type: Number,
    //     default: 0
    // },
    // description: {
    //     type: String,
    //     default: null
    // },
    // tokenId: {
    //     type: String,
    //     default: null
    // },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        default: "User"
    },
    is_blocked: {
        type: Number,
        default: 0
    },
},
    {
        timestamps: true
    })

const transactionSchema = mongoose.Schema({
    tokenId: {
        type: String,
        trim: true,
        default: null
    },
    amount: {
        type: Number,
        trim: true,
        default: null
    },
    description: {
        type: String,
        trim: true,
        default: null
    },
    
    cardId: {
        type: mongoose.Schema.Types.ObjectId,
        default: "Card"
    },
    is_blocked: {
        type: Number,
        default: 0
    },
},
    {
        timestamps: true
    })

const Card = mongoose.model("Card", cardSchema)
const Transaction = mongoose.model("Transaction", transactionSchema)

module.exports = { Card, Transaction }