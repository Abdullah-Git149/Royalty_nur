const express = require('express');
const router = express.Router()
const { addDocuments, getDocuments, addNewDocuments } = require("../controller/documentController")

const auth = require("../auth/auth")
const { upload } = require("../utils/utils")

router.post("/api/upload-document", auth, upload.fields([
    { name: "aclsLicense" },
    { name: "blsLicense" },
    { name: "cnaCertificate" },
    { name: "covidVaccine" },
    { name: "cprLicense" },
    { name: "driverLicense" },
    { name: "hepatitisLicense" },
    { name: "nursingLicense" },
    { name: "socialSecurity" }
]),
    addDocuments)

router.get("/api/get-documents", auth, getDocuments)
router.post("/api/add-new-doc", auth, addNewDocuments)




module.exports = router