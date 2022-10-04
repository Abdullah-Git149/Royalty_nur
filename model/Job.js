const mongoose = require("mongoose")
const jwt = require("jsonwebtoken")
const bcrypt = require("bcryptjs")
const moment = require("moment")

const jobSchema = mongoose.Schema({
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        default: null
    },
    hospital_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Hospital",
        default: null
    },
    approve: {
        type: Boolean,
        default: false
    },
    date: {
        type: Date,
        trim: true,
        default: moment(new Date()).format("YYYY-MM-DD")
    },
    day: {
        type: String,
        enum: ["mon", "tues", "wed", "thurs", "fri", "sat", "sun"],
        default: "mon"
    },

},
    {
        timestamps: true
    })





const Job = mongoose.model("Job", jobSchema)

module.exports = Job