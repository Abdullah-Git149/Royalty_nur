const { Document, NewDocument } = require("../model/Document")

const addDocuments = async (req, res) => {
    try {

        const document = await Document.findOne({ userId: req.payload._id })
        // console.log(document);
        // console.log(req.payload.user);

        // if (document) {

        const updateDoc = await Document.findOneAndUpdate(
            {
                userId: document.userId
            },
            {
                // "driverLicense.name": req.body.driverLicense,
                // "cnaCertificate.name": req.body.cnaCertificate,
                // "nursingLicense.name": req.body.nursingLicense,
                // "socialSecurity.name": req.body.socialSecurity,
                // "cprLicense.name": req.body.cprLicense,
                // "blsLicense.name": req.body.blsLicense,
                // "aclsLicense.name": req.body.aclsLicense,
                // "hepatitisLicense.name": req.body.hepatitisLicense,




                "driverLicense.document": (req.files.driverLicense ? req.files.driverLicense[0].path : req.body.driverLicense),
                "driverLicense.status": (req.files.driverLicense ? 1 : document.driverLicense.status),
                "cnaCertificate.document": (req.files.cnaCertificate ? req.files.cnaCertificate[0].path : req.body.cnaCertificate),
                "cnaCertificate.status": (req.files.cnaCertificate ? 1 : document.cnaCertificate.status),
                "nursingLicense.document": (req.files.nursingLicense ? req.files.nursingLicense[0].path : req.body.nursingLicense),
                "nursingLicense.status": (req.files.nursingLicense ? 1 : document.nursingLicense.status),
                "socialSecurity.document": (req.files.socialSecurity ? req.files.socialSecurity[0].path : req.body.socialSecurity),
                "socialSecurity.status": (req.files.socialSecurity ? 1 :document.socialSecurity.status),
                "cprLicense.document": (req.files.cprLicense ? req.files.cprLicense[0].path : req.body.cprLicense),
                "cprLicense.status": (req.files.cprLicense ? 1 : document.cprLicense.status),
                "blsLicense.document": (req.files.blsLicense ? req.files.blsLicense[0].path : req.body.blsLicense),
                "blsLicense.status": (req.files.blsLicense ? 1 : document.blsLicense.status),
                "aclsLicense.document": (req.files.aclsLicense ? req.files.aclsLicense[0].path : req.body.aclsLicense),
                "aclsLicense.status": (req.files.aclsLicense ? 1 :document.aclsLicense.status),
                "covidVaccine.document": (req.files.covidVaccine ? req.files.covidVaccine[0].path : req.body.covidVaccine),
                "covidVaccine.status": (req.files.covidVaccine ? 1 :document.covidVaccine.status),
                "hepatitisLicense.document": (req.files.hepatitisLicense ? req.files.hepatitisLicense[0].path : req.body.hepatitisLicense),
                "hepatitisLicense.status": (req.files.hepatitisLicense ? 1 : document.hepatitisLicense.status),
            },
            {
                new: true
            }
        );

        return res.status(200).json({ status: 1, msg: "Document updated", updateDoc })
        // } else {

        //     const doc = await Document({
        //         userId: req.payload._id,

        //         // "driverLicense.name": req.body.driverLicense,
        //         // "cnaCertificate.name": req.body.cnaCertificate,
        //         // "nursingLicense.name": req.body.nursingLicense,
        //         // "socialSecurity.name": req.body.socialSecurity,
        //         // "cprLicense.name": req.body.cprLicense,
        //         // "blsLicense.name": req.body.blsLicense,
        //         // "aclsLicense.name": req.body.aclsLicense,
        //         // "hepatitisLicense.name": req.body.hepatitisLicense,



        //         "driverLicense.document": (req.files.driverLicense ? req.files.driverLicense[0].path : req.body.driverLicense),
        //         "driverLicense.status": (req.files.driverLicense ? 1 : 0),
        //         "cnaCertificate.document": (req.files.cnaCertificate ? req.files.cnaCertificate[0].path : req.body.cnaCertificate),
        //         "cnaCertificate.status": (req.files.cnaCertificate ? 1 : 0),
        //         "nursingLicense.document": (req.files.nursingLicense ? req.files.nursingLicense[0].path : req.body.nursingLicense),
        //         "nursingLicense.status": (req.files.nursingLicense ? 1 : 0),
        //         "socialSecurity.document": (req.files.socialSecurity ? req.files.socialSecurity[0].path : req.body.socialSecurity),
        //         "socialSecurity.status": (req.files.socialSecurity ? 1 : 0),
        //         "cprLicense.document": (req.files.cprLicense ? req.files.cprLicense[0].path : req.body.cprLicense),
        //         "cprLicense.status": (req.files.cprLicense ? 1 : 0),
        //         "blsLicense.document": (req.files.blsLicense ? req.files.blsLicense[0].path : req.body.blsLicense),
        //         "blsLicense.status": (req.files.blsLicense ? 1 : 0),
        //         "aclsLicense.document": (req.files.aclsLicense ? req.files.aclsLicense[0].path : req.body.aclsLicense),
        //         "aclsLicense.status": (req.files.aclsLicense ? 1 : 0),
        //         "covidVaccine.document": (req.files.covidVaccine ? req.files.covidVaccine[0].path : req.body.covidVaccine),
        //         "covidVaccine.status": (req.files.covidVaccine ? 1 : 0),
        //         "hepatitisLicense.document": (req.files.hepatitisLicense ? req.files.hepatitisLicense[0].path : req.body.hepatitisLicense),
        //         "hepatitisLicense.status": (req.files.hepatitisLicense ? 1 : 0),

        //     })

        //     await doc.save()
        //     return res.status(201).json({ status: 1, msg: "Document Created successfully", data: doc })
        // }





    } catch (error) {
        console.log(error.message)
        return res.status(500).json({ error: error.message })
    }
}


const getDocuments = async (req, res) => {
    try {
        const document = await Document.findOne({ userId: req.payload._id })

        if (document) {
            const { driverLicense, cnaCertificate, nursingLicense, socialSecurity, cprLicense, blsLicense, aclsLicense, covidVaccine, hepatitisLicense } = document
            return res.status(200).json({ status: 1, message: "List of Document", data: [driverLicense, cnaCertificate, nursingLicense, socialSecurity, cprLicense, blsLicense, aclsLicense, covidVaccine, hepatitisLicense] })
        } else {
            return res.status(400).json({ status: 0, msg: "Please submit doucments" })
        }
    } catch (error) {
        console.log(error.message)
        return res.status(500).json({ error: error.message })
    }
}




const addNewDocuments = async (req, res) => {
    try {
        const findDoc = await NewDocument.findOne({ userId: req.payload._id })

        if (!findDoc) {
            const doc = new NewDocument({
                "documents.name": req.body.name,
                // "documents.document": (req.file ? req.file.path : req.body.user_Image)
            })
            await doc.save()
            return res.status(200).json({ status: 1, msg: "Successfully Created", data: doc })
        } else {
            const upDoc = await NewDocument.findByIdAndUpdate({ userId: req.payload._id }, { "documents.name": [...req.body.name], }, { new: true })
            return res.status(200).json({ status: 1, msg: "Successfully Updated", data: upDoc })
        }

    } catch (error) {

        console.log(error.message)
        return res.status(500).json({ error: error.message })
    }
}

module.exports = { addDocuments, getDocuments, addNewDocuments }