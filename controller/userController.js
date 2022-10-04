const User = require("../model/User")
const bcrypt = require("bcryptjs")
const { sendEmail } = require("../utils/utils")
const { Document, NewDocument } = require("../model/Document")


const signUp = async (req, res) => {
    try {
        if (!req.body.user_email) {
            return res.status(404).json({ status: 0, msg: "Email is required" })
        } else if (!req.body.user_password) {
            return res.status(404).jsson({ status: 0, msg: "Password is required" })
        } else if (!req.body.confirm_password) {
            return res.status(404).json({ status: 0, msg: "Confirm Password is required" })
        } else if (req.body.user_password !== req.body.confirm_password) {
            return res.status(404).json({ status: 0, msg: "Password Mismatch" })

        } else {
            const check = await User.findOne({ user_email: req.body.user_email })
            if (check) {
                return res.status(400).json({ status: 0, msg: "This email is occupied by another user" })
            } else {

                const salt = 10
                const hashPassword = await bcrypt.hash(req.body.user_password, salt)
                const verificationCode = Math.floor(100000 + Math.random() * 900000)

                const user = new User({
                    user_email: req.body.user_email,
                    user_password: hashPassword,
                    code: verificationCode,
                    role: req.body.role,
                    verified: 0
                })

                const token = await user.generateAuthToken()
                await user.save().then(async (result) => {
                    sendEmail(user.user_email, verificationCode, "Email Verification Code")


                    const doc = new Document({
                        "driverLicense.model": "driverLicense",
                        "cnaCertificate.model": "cnaCertificate",
                        "nursingLicense.model": "nursingLicense",
                        "socialSecurity.model": "socialSecurity",
                        "cprLicense.model": "cprLicense",
                        "blsLicense.model": "blsLicense",
                        "aclsLicense.model": "clsLicense",
                        "hepatitisLicense.model": "hepatitisLicense",
                        "covidVaccine.model": "covidVaccine",

                        "driverLicense.name": "Driver License",
                        "cnaCertificate.name": "CNA Certificate",
                        "nursingLicense.name": "Nursing License",
                        "socialSecurity.name": "Social Security",
                        "cprLicense.name": "CPR License",
                        "blsLicense.name": "BLS License",
                        "aclsLicense.name": "CLS License",
                        "hepatitisLicense.name": "Hepatitis License",
                        "covidVaccine.name": "Covid Vaccine",
                        userId: result._id

                    })

                    await doc.save()
                    console.log(doc)
                    return res.status(201).json({
                        status: 1, msg: "Account has been created",
                        data: {
                            token: token, _id: result._id, code: result.code,
                        }
                    })
                }).catch((err) => {
                    res.status(400).json({ status: 0, msg: "Something went wrong", error: err.message })
                })
            }
        }
    } catch (error) {
        console.log(error.message);
        return res.status(400).send(error.message);

    }
}


const signIn = async (req, res) => {
    try {
        if (!req.body.user_email) {
            return res.status(404).json({ status: 0, msg: "Email is required" })
        } else if (!req.body.user_password) {
            return res.status(404).jsson({ status: 0, msg: "Password is required" })
        } else {
            const user = await User.findOne({ user_email: req.body.user_email })
            if (!user) {
                return res.status(404).json({ status: 0, msg: "User not found" })
            } else {
                const isMatch = await bcrypt.compare(req.body.user_password, user.user_password)
                if (!isMatch) {
                    return res.status(404).json({ status: 0, msg: "Password not match" })
                } else {
                    const token = await user.generateAuthToken();
                    const upatedRecord = await User.findOneAndUpdate(
                        { _id: user._id}, 
                        { is_verified: 1,
                        user_authentication: token,
                        user_social_token:req.body.user_social_token,
                        user_social_type:req.body.user_social_type,
                        user_device_type:req.body.user_device_type,
                        user_device_token:req.body.user_device_token}
                        , { new: true });
                    return res.status(200).json({
                        status: 1, msg: "User Login Successful",
                        data: {
                            _id: upatedRecord._id,
                            code: upatedRecord.code,
                            verified: upatedRecord.verified,
                            token: upatedRecord.user_authentication,
                            full_name: upatedRecord.full_name,
                            user_Image: upatedRecord.user_Image,
                            user_email: upatedRecord.user_email,
                            ssn: upatedRecord.ssn,
                            license_num: upatedRecord.license_num,
                            position: upatedRecord.position,
                     
                        }
                    })

                }
            }
        }
    }
    catch (error) {
        console.log(error.message);
        return res.status(400).send(error.message);
    }
}


const verifyUser = async (req, res) => {
    try {
        if (!req.body.user_id) {
            return res.status(400).json({ status: 0, msg: "User Id is required" })
        } else if (!req.body.verficationCode) {
            return res.status(400).json({ status: 0, msg: "verficationCode is required" })
        }
        await User.findOne({ _id: req.body.user_id }).then((result) => {


            if (req.body.verficationCode == result.code) {
                User.findByIdAndUpdate({ _id: req.body.user_id }, { verified: 1, code: null }, (error, _result) => {
                    if (error) {
                        console.log(error.message);
                        return res.status(400).json({ status: 0, msg: "Something Went Wrong", error })
                    }
                    if (_result) {
                        return res.status(200).json({ status: 1, msg: "OTP matched successfully", token: _result.user_authentication })
                    }
                })
            } else {
                return res.status(400).json({ status: 0, msg: "OTP not matched " })
            }
        }).catch((err) => {
            console.log(err.message);
            return res.status(400).json({ status: 0, msg: "Verification code not matched" })

        })
    } catch (error) {
        console.log(error.message);
        return res.status(500).json({ error: error.message });

    }
}



// FORGET PASSWORD


const forgetPassword = async (req, res) => {
    try {
        if (!req.body.user_email) {
            return res.status(400).json({ status: 0, msg: "Email is required" });
        } else {
            const user = await User.findOne({ user_email: req.body.user_email })
            if (!user) {
                return res.status(400).json({ status: 0, msg: "User not found" });
            } else {
                const verficationCode = Math.floor(100000 + Math.random() * 900000)
                const newUser = await User.findByIdAndUpdate({ _id: user._id }, { code: verficationCode })
                if (newUser) {
                    sendEmail(user.user_email, verficationCode, "Forget Password")
                    return res.status(200).json({ status: 1, msg: "Code successfully send to email : " + verficationCode, userId: newUser._id })
                } else {
                    return res.status(200).json({ status: 0, msg: "Something went wrong" })
                }
            }
        }
    } catch (error) {
        console.log(error.message);
        return res.status(500).json({ error: error.message });
    }
}

const resetPassword = async (req, res) => {
    try {
        if (!req.body.user_id) {
            return res.status(400).json({ status: 0, msg: "User id is required" })
        } else if (!req.body.user_password) {
            return res.status(400).json({ status: 0, msg: "Please enter a password" })
        } else {
            const user = await User.findById(req.body.user_id)
            if (!user) {
                return res.status(400).json({ status: 0, msg: "User not found" })
            } else {
                const hashPassword = await bcrypt.hash(req.body.user_password, 10)

                const hashedUser = await User.findByIdAndUpdate({ _id: user._id }, { user_password: hashPassword })
                if (hashPassword) {
                    return res.status(200).json({ status: 1, msg: "Password changed Succussfully" })
                } else {

                    return res.status(400).json({ status: 0, msg: "Something went wrong" })
                }
            }
        }
    } catch (error) {

        console.log(error.message);
        return res.status(500).json({ error: error.message });
    }
}



const updatePassword = async (req, res) => {
    try {
        if (!req.body.user_password) {
            return res.status(400).json({ status: 0, msg: "Please enter old password" })
        } else if (!req.body.user_new_password) {
            return res.status(400).json({ status: 0, msg: "Please enter new password" })
        }
        const user = await User.findById(req.payload._id)


        const isMatch = await bcrypt.compare(req.body.user_password, user.user_password)
        if (!isMatch) {
            return res.status(400).json({ status: 0, msg: "Please enter correct old password" })
        } else {
            const hashPassword = await bcrypt.hash(req.body.user_new_password, 10)
            const newUser = await User.findByIdAndUpdate({ _id: req.payload._id }, { user_password: hashPassword })
            await newUser.save()

            return res.status(200).json({ status: 1, msg: "Password changed successfully" })

        }
    } catch (error) {
        console.log(error.message);
        return res.status(500).json({ error: error.message });

    }
}

const setUpProfile = async (req, res) => {
    try {

        const user = await User.findOneAndUpdate({ _id: req.payload._id }, {
            user_email: req.payload.user_email,
            user_password: req.payload.user_password,
            full_name: req.body.full_name,
            license_num: req.body.license_num,
            ssn: req.body.ssn,
            position: req.body.position,
            user_Image: req.file ? req.file.path : req.body.user_Image

        }, { new: true })

        const newUser = await user.save()
        const { _id, full_name, license_num, ssn, position, user_Image, role, user_email, __v } = newUser
        return res.status(200).json({ status: 1, msg: "Profile Updated Successfully", user: { _id: _id, full_name: full_name, license_num: license_num, ssn: ssn, position: position, user_Image: user_Image, role: role, user_Image: user_Image, __v: __v, user_email: user_email } })


    } catch (error) {
        console.log(error.message);
        return res.status(500).json({ error: error.message });
    }
}




const resendCode = async (req, res) => {
    try {
        if (!req.body.user_id) {
            return res.status(400).json({ status: 0, msg: "User ID is required" });
        } else {
            const user = await User.findOne({ _id: req.body.user_id })

            const verification_code = Math.floor(100000 + Math.random() * 900000)

            const newUser = await User.findByIdAndUpdate({ _id: req.body.user_id }, { verified: 0, code: verification_code }, { new: true })
            if (newUser) {
                sendEmail(newUser.user_email, verification_code, "Verification code Resend")
                return res.status(200).json({ status: 1, msg: "Verification code Resend successfully", code: verification_code })

            } else {
                resendCode.status(400).json({ status: 0, msg: "Something went wrong" })

            }
        }
    } catch (error) {
        console.log(error.message);
        return res.status(500).json({ error: error.message });

    }
}




const logOut = async (req, res) => {
    try {

        const user = await User.findOne({ _id: req.payload._id })

        if (user.user_authentication === null) {
            return res.status(400).json({ status: 0, msg: "User already logOut" })
        } else {
            const logout = await User.findByIdAndUpdate({ _id: req.payload._id }, { user_authentication: null, code: null,user_device_token:null,user_device_type:null }, { new: true })
            if (logout) {
                return res.status(200).json({ status: 1, msg: "Successfully logged out" })
            } else {
                return res.status(400).json({ status: 0, msg: "Something went wrong" })
            }
        }
    } catch (error) {
        console.log(error.message);
        return res.status(500).json({ error: error.message });
    }
}



const getUser = async (req, res) => {
    try {
        const user = await User.findOne({ _id: req.payload._id })
        if (user) {
            return res.status(200).json({ status: 1, msg: "User Details", user: user })
        } else {
            return res.status(400).json({ status: 0, msg: "Please Login" })
        }

    } catch (error) {
        console.log(error.message);
        return res.status(500).json({ error: error.message });

    }
}


const updateUser = async (req, res) => {
    try {
        const user = await User.findOneAndUpdate({ _id: req.payload._id },{
            full_name:req.body.full_name,
            license_num:req.body.license_num,  
            user_Image: req.file ? req.file.path : req.body.user_Image
            
         },{new:true})


        // user.full_name = req.body.full_name
        // user.license_num = req.body.license_num
        // user.ssn = req.body.ssn
        // user.user_Image = req.file ? req.file.path : req.body.user_Image
        // complete_address = req.body.user_address + " " + req.body.zip_code + " " + req.body.state
        // user.user_address = complete_address


        await user.save()
        const { _id, full_name, license_num, ssn, position, user_Image, role, user_email, __v } = user
         console.log(user)
        if (user) {


            return res.status(200).json({ status: 1, msg: "Profile Updated successfully", user: { _id: _id, full_name: full_name, license_num: license_num, ssn: ssn, position: position, user_Image: user_Image, role: role, user_Image: user_Image, __v: __v, user_email: user_email } })
        } else {

            return res.status(400).json({ status: 0, msg: "Something went wrong" })
        }
    } catch (error) {

        console.log(error.message);
        return res.status(500).json({ error: error.message });
    }
}




//** Social Login *//
const socialLogin = async (req, res) => {
    try {
        const alreadyUserAsSocialToke = await User.findOne({ user_social_token: req.body.user_social_token })
        if (alreadyUserAsSocialToke) {
            if (alreadyUserAsSocialToke.user_type !== req.body.user_type) {
                return res.status(400).send({ status: 0, message: "Invalid User Type!" });
            }
        }
        if (!req.body.user_social_token) {
            return res.status(400).send({ status: 0, message: 'User Social Token field is required' });
        }
        else if (!req.body.user_social_type) {
            return res.status(400).send({ status: 0, message: 'User Social Type field is required' });
        }
        else if (!req.body.user_device_type) {
            return res.status(400).send({ status: 0, message: 'User Device Type field is required' });
        }
        else if (!req.body.user_device_token) {
            return res.status(400).send({ status: 0, message: 'User Device Token field is required' });
        }
        else {
            const checkUser = await User.findOne({ user_social_token: req.body.user_social_token });
            if (!checkUser) {
                const newRecord = new User();
                // if(req.file){
                //     newRecord.user_image    = req.file.path
                //  }
                // const customer = await stripe.customers.create({
                //     description: 'New Customer Created',
                // });
                // newRecord.stripe_id = customer.id;
                // newRecord.user_image = req.body.user_image ? req.body.user_image : ""
                // newRecord.user_image = req.body.user_image
                // newRecord.user_image = req.file ? req.file.path : req.body.user_image,
                newRecord.user_social_token = req.body.user_social_token,///
                    newRecord.user_social_type = req.body.user_social_type,
                    newRecord.user_device_type = req.body.user_device_type,
                    newRecord.user_device_token = req.body.user_device_token
                // newRecord.user_name = req.body.user_name,////
                newRecord.user_email = req.body.user_email,
                    //newRecord.user_type = req.body.user_type,
                    newRecord.verified = 1
                await newRecord.generateAuthToken();
                const saveLogin = await newRecord.save();
                
                 const doc = new Document({
                        "driverLicense.model": "driverLicense",
                        "cnaCertificate.model": "cnaCertificate",
                        "nursingLicense.model": "nursingLicense",
                        "socialSecurity.model": "socialSecurity",
                        "cprLicense.model": "cprLicense",
                        "blsLicense.model": "blsLicense",
                        "aclsLicense.model": "clsLicense",
                        "hepatitisLicense.model": "hepatitisLicense",
                        "covidVaccine.model": "covidVaccine",

                        "driverLicense.name": "Driver License",
                        "cnaCertificate.name": "CNA Certificate",
                        "nursingLicense.name": "Nursing License",
                        "socialSecurity.name": "Social Security",
                        "cprLicense.name": "CPR License",
                        "blsLicense.name": "BLS License",
                        "aclsLicense.name": "CLS License",
                        "hepatitisLicense.name": "Hepatitis License",
                        "covidVaccine.name": "Covid Vaccine",
                        userId: saveLogin._id

                    })

                    await doc.save()
                // return res.status(200).send({ status: 1, message: 'Login Successfully', data: { _id: saveLogin._id, verified: saveLogin.verified, code: saveLogin.code, token: saveLogin.token, full_name: saveLogin.full_name, user_social_token: saveLogin.user_social_token, user_social_type: saveLogin.user_social_type, user_device_type: saveLogin.user_device_type, user_device_token: saveLogin.user_device_token, user_authentication: saveLogin.user_authentication } });
                return res.status(200).send({ status: 1, message: 'Login Successfully', data: saveLogin });
            } else {
                const token = await checkUser.generateAuthToken();
                const upatedRecord = await User.findOneAndUpdate({ _id: checkUser._id },
                    { user_device_type: req.body.user_device_type, user_device_token: req.body.user_device_token, verified: 1, user_authentication: token }
                    , { new: true });
                    
                        const doc = new Document({
                        "driverLicense.model": "driverLicense",
                        "cnaCertificate.model": "cnaCertificate",
                        "nursingLicense.model": "nursingLicense",
                        "socialSecurity.model": "socialSecurity",
                        "cprLicense.model": "cprLicense",
                        "blsLicense.model": "blsLicense",
                        "aclsLicense.model": "clsLicense",
                        "hepatitisLicense.model": "hepatitisLicense",
                        "covidVaccine.model": "covidVaccine",

                        "driverLicense.name": "Driver License",
                        "cnaCertificate.name": "CNA Certificate",
                        "nursingLicense.name": "Nursing License",
                        "socialSecurity.name": "Social Security",
                        "cprLicense.name": "CPR License",
                        "blsLicense.name": "BLS License",
                        "aclsLicense.name": "CLS License",
                        "hepatitisLicense.name": "Hepatitis License",
                        "covidVaccine.name": "Covid Vaccine",
                        userId: upatedRecord._id

                    })

                    await doc.save()
                    
                // return res.status(200).send({ status: 1, message: 'Login Successfully', data: { _id: upatedRecord._id, verified: upatedRecord.verified, code: upatedRecord.code, token: token, full_name: upatedRecord.full_name, user_social_token: upatedRecord.user_social_token, user_social_type: upatedRecord.user_social_type, user_device_type: upatedRecord.user_device_type, user_device_token: upatedRecord.user_device_token, user_authentication: upatedRecord.user_authentication } });
                return res.status(200).send({ status: 1, message: 'Login Successfully', data:upatedRecord});
            }
        }
        // console.log(upatedRecord)
    }
    catch (error) {
        console.log('error *** ', error);
        res.status(500).json({
            status: 0,
            message: error.message
        });
    }
}


const getAllUser = async (req, res) => {
    try {
        const users = await User.find({})
        if (users.length < 0) {
            return res.status(400).json({ status: 0, msg: "User  not found" })
        } else {
            const count = users.length
            return res.status(200).json({ status: 1, count: count, msg: "List of Users", users, users })
        }
    } catch (error) {
        console.log(error.message);
        return res.status(500).json({ error: error.message });

    }
}

const deleteUser = async (req, res) => {
    try {
        const id = req.params.id
        const user = await User.findByIdAndRemove(id)

        if (user) {
            return res.status(200).json({ status: 1, msg: "User deleted Successfully" })
        } else {
            return res.status(400).json({ status: 0, msg: "Something went wrong" })
        }
    } catch (error) {
        console.log(error.message);
        return res.status(500).json({ error: error.message });

    }
}

module.exports = { signUp, signIn, verifyUser, forgetPassword, updatePassword, resetPassword, setUpProfile, resendCode, logOut, getUser, updateUser, socialLogin, getAllUser, deleteUser }

