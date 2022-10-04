const mongoose = require("mongoose")



const documentSchema = mongoose.Schema({
    driverLicense: {
        document: { type: String, default: null },
        status: { type: Number, enum: [0, 1, 2], default: 0 },
        name: { type: String, default: "driverLicense" },
        model: { type: String, default: null },

    },
    cnaCertificate: {
        document: { type: String, default: null },
        status: { type: Number, enum: [0, 1, 2], default: 0 },
        name: { type: String, default: "cnaCertificate" },
        model: { type: String, default: null },

    },
    nursingLicense: {
        document: { type: String, default: null },
        status: { type: Number, enum: [0, 1, 2], default: 0 },
        name: { type: String, default: "nursingLicense" }
        ,
        model: { type: String, default: null },
    },
    socialSecurity: {
        document: { type: String, default: null },
        status: { type: Number, enum: [0, 1, 2], default: 0 }
        ,
        name: { type: String, default: "socialSecurity" }
        ,
        model: { type: String, default: null },
    },
    cprLicense: {
        document: { type: String, default: null },
        status: { type: Number, enum: [0, 1, 2], default: 0 }
        ,
        name: { type: String, default: "cprLicense" },
        model: { type: String, default: null },
    },
    blsLicense: {
        document: { type: String, default: null },
        status: { type: Number, enum: [0, 1, 2], default: 0 }
        ,
        name: { type: String, default: "blsLicense" },
        model: { type: String, default: null },
    },
    aclsLicense: {
        document: { type: String, default: null },
        status: { type: Number, enum: [0, 1, 2], default: 0 }
        ,
        name: { type: String, default: "aclsLicense" },
        model: { type: String, default: null },
    },
    covidVaccine: {
        document: { type: String, default: null },
        status: { type: Number, enum: [0, 1, 2], default: 0 }
        ,
        name: { type: String, default: "covidVaccine" },
        model: { type: String, default: null },
    },
    hepatitisLicense: {
        document: { type: String, default: null },
        status: { type: Number, enum: [0, 1, 2], default: 0 } ,
        name: { type: String, default: "hepatitisLicense" },
        model: { type: String, default: null },
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId, ref: "User"
    }
},
    {
        timestamps: true
    })




const newDocumentSchema = mongoose.Schema({
    documents: [{
        document: { type: String, default: null },
        name: { type: String, default: null },
        status: { type: Number, enum: [0, 1, 2], default: 0 }
    }],
    userId: {
        type: mongoose.Schema.Types.ObjectId, ref: "User"
    }
},
    {
        timestamps: true
    })



const Document = mongoose.model("Document", documentSchema)
const NewDocument = mongoose.model("NewDocument", newDocumentSchema)

module.exports = { Document, NewDocument }