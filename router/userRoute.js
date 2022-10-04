const express = require('express');
const router = express.Router()
const { signUp, signIn, verifyUser, forgetPassword, updatePassword, setUpProfile, resendCode, logOut, resetPassword, updateUser, getUser, socialLogin, getAllUser, deleteUser } = require("../controller/userController")
const auth = require("../auth/auth")
const { upload } = require("../utils/utils")
const { getContent } = require("../controller/contentController")

router.post("/api/sign-up", signUp)
router.post("/api/sign-in", signIn)
router.post("/api/sociaLlogin", socialLogin)
router.post("/api/verify-user", verifyUser)
router.post("/api/resend-code", resendCode)
router.post("/api/forget-password", forgetPassword)
router.post("/api/reset-password", resetPassword)
router.post("/api/update-password", auth, updatePassword)
router.post("/api/update-user", auth,upload.single("user_Image"), updateUser)
router.post("/api/setup-Profile", auth, upload.single("user_Image"), setUpProfile)
router.get("/api/profile", auth, getUser)
router.get("/api/log-out", auth, logOut)
router.get("/api/list-of-users", getAllUser)
router.post("/api/delete-user/:id", deleteUser)





// CONTENT ROUTER----
router.get('/api/get-content/:type', getContent)



module.exports = router