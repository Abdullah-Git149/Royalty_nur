const mongoose = require("mongoose")
const jwt = require("jsonwebtoken")
const bcrypt = require("bcryptjs")
const moment = require("moment")

const hospitalSchema = mongoose.Schema({
    hospital_name: {
        type: String,
        trim: true,
        default: null
    },
    hospital_Image: {
        type: String,
        default: null
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
    job_title: {
        type: String,
        trim: true,
        default: null
    },
    job_timing: {
        type: String,
        trim: true,
        default: null
    },
    hourly_rate: {
        type: Number,
        default: null
    },
    job_location: {
        type: String,
        trim: true,
        default: null
    },
    location: {
        longitude: { type: String },
        latitude: { type: String },
    },
    // applied: {
    //     type: Boolean,
    //     default: false
    // }
},
    {
        timestamps: true
    })




const Hospital = mongoose.model("Hospital", hospitalSchema)

module.exports = Hospital