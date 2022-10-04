const mongoose = require("mongoose")
const jwt = require("jsonwebtoken")
const bcrypt = require("bcryptjs")
const userSchema = mongoose.Schema({
    full_name: {
        type: String,
        trim: true,
        default: null
    },
    license_num: {
        type: String,
        trim: true,
        default: null
    },
    ssn: {
        type: String,
        trim: true,
        default: null
    },
    position: {
        type: String,
        trim: true,
        enum: ["nurse", "License Practical Nurse","Registered Nurse","Certified Nursing Assistants"],
        default: "nurse"
    },
    user_email: {
        type: String,
        trim: true,
        default: null
    },
    user_password: {
        type: String,
        trim: true,

    },
    user_Image: {
        type: String,
        default: null
    },
    user_authentication: {
        type: String,
        default: null,
        required: false
    },
    user_social_token: {
        type: String,
        required: false,
        trim: true,
        default: null
    },
    user_social_type: {
        type: String,
        required: false,
        trim: true,
        default: null
    },
    user_device_type: {
        type: String,
        required: false,
        trim: true,
        default: null
    },
    user_device_token: {
        type: String,
        required: false,
        trim: true,
        default: null
    },
    user_address: {
        type: String,
        default: null
    },
    code: {
        type: Number,
        default: null
    },
    verified: {
        type: Number,
        default: 0
    },
    role: {
        type: String,
        default: "user"
    },
    appliedHospitals: [{
        hospitalId: { type: mongoose.Schema.Types.ObjectId, ref: "Hospital" },
        status: { type: Boolean, default: false }
    }],
    is_blocked: {
        type: Number,
        default: 0
    },
},
    {
        timestamps: true
    })


userSchema.methods.generateAuthToken = async function () {
    const user = this;
    const token = jwt.sign({
        user_email: user.user_email,
        _id: user._id,
        role: user.role
    },
        process.env.KEY);
    user.user_authentication = token;
    await user.save();
    //console.log("tokeeen--->", token);
    return token;
}

const User = mongoose.model("User", userSchema)

module.exports = User