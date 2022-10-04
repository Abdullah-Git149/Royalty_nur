const express = require('express');
const router = express.Router()
const auth = require("../auth/auth")
const { upload } = require("../utils/utils")
const { postShift, viewAllJob,getNotification, applyJob, approveJobRequest, findJobs, findMyJobs, myPreviousShifts, myComingShifts,getHospitalDetail,currentJob } = require("../controller/hospitalController")
const { verifyHospital, verifyUser } = require("../auth/verifyHospital")




router.post("/api/post-shift", auth, verifyHospital("hospital"), postShift)
router.post("/api/apply-job", auth, verifyUser("user"), applyJob)
router.post("/api/approve-job-request", auth, verifyHospital("hospital"), approveJobRequest)
router.get("/api/find-jobs", findJobs)
router.get("/api/my-jobs", auth, findMyJobs)
router.get("/api/previous-shifts", auth, myPreviousShifts)
router.get("/api/coming-shifts", auth, myComingShifts)
router.get("/api/today-shifts",auth, currentJob)
router.get("/api/get-notification", auth, getNotification)
router.get("/api/shift-detail/:id", getHospitalDetail)
router.get("/api/view-all-jobs", viewAllJob)










module.exports = router