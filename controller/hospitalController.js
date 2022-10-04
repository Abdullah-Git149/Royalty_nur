const Hospital = require("../model/Hospital");
const Job = require("../model/Job");
const User = require("../model/User");
// const { push_notification } = require("../utils/utils")
const Notification = require("../model/Notification");
const { push_notifications } = require("../utils/push_notifications")
const moment = require("moment")
const ApiFeatures = require("../utils/apiFeatures");


const postShift = async (req, res) => {
    try {
        if (!req.body.job_title) {
            return res.status(400).json({ status: 0, msg: "Job title is required" });
        } else if (!req.body.job_timing) {
            return res.status(400).json({ status: 0, msg: "Job timing is required" });
        } else if (!req.body.hourly_rate) {
            return res.status(400).json({ status: 0, msg: "Hourly is required" });
        } else {


            const hospitalUser = await User.findOne({ _id: req.payload._id })
            console.log(hospitalUser)
            // console.log("payloadddd" ,req.payload)
  
            const addShift = new Hospital({

                hospital_name: hospitalUser.full_name,
                hospital_Image:hospitalUser.user_Image,
                job_title: req.body.job_title,
                job_timing: req.body.job_timing,
                hourly_rate: req.body.hourly_rate,
                "location.longitude": req.body.longitude,
                "location.latitude": req.body.latitude,
                date: req.body.date
            })
            await addShift.save()

            return res.status(201).json({ status: 1, msg: "Shift is created successfully", shift: addShift })
        }
    } catch (error) {
        console.log(error.message)
        return res.status(500).json({ error: error.message })
    }
}




const viewAllJob = async (req, res) => {
    try {

        const allshifts = await Hospital.find();

        const apiFeature = new ApiFeatures(Hospital.find(), req.query).filter()

        const hospital = await apiFeature.query


        
         if (req.query.job_title === '' || req.query.hospital_name === '') {
            return res.status(200).send({
            status: 1,
            msg: "all Shifts",
            jobs: allshifts,
        });
        } else {
            // console.log(apiFeature.query);
            return res.status(200).send({
            status: 1,
            msg: "all Shifts",
            jobs:hospital,
            });
        }

    } catch (error) {
        console.log(error.message)
        return res.status(500).json({ error: error.message })

    }

}
const applyJob = async (req, res) => {
    try {
        if (!req.body.hospital_id) {
            return res.status(400).json({ status: 0, msg: "Hospital is required" })
        } else {


            // const user = await User.findById({ _id: req.payload.user._id })
            // if (user.appliedHospitals.hospitalId.includes(req.body.hospital_id)) {
            //     return res.status(400).json({ status: 0, msg: "You already applied for this hospital" })
            // } else {

            const apply = await User.findByIdAndUpdate(
                { _id: req.payload._id },
                {
                    $push: {
                        "appliedHospitals": { hospitalId: req.body.hospital_id }
                    }
                },
                {
                    new: true
                })

            const hospital = await Hospital.findOne({ _id: req.body.hospital_id })

            const job = await Job({
                user_id: apply._id,
                hospital_id: req.body.hospital_id,
                date: hospital.date,
                day: hospital.day
            })

            await job.save()
            await apply.save()
            if (apply) {
                return res.status(200).json({ status: 1, msg: `Succesfully applied`, user: apply })
            } else {
                return res.status(400).json({ status: 0, msg: `Something went wrong` })

            }
            // }
        }



    } catch (error) {
        console.log(error.message)
        return res.status(500).json({ error: error.message })

    }
}






const approveJobRequest = async (req, res) => {
    try {
        const approveJob = await Job.findByIdAndUpdate(
            { _id: req.body.job_id },
            { approve: true },
            { new: true }
        ).populate("user_id")
            .populate("hospital_id")
        // await approveJob.save()
        const receiver_object = await User.find({
            _id: approveJob.user_id._id,
        });

        const sender_object = await Hospital.find({
            _id: approveJob.hospital_id._id,
        });

     console.log("sender_object" , sender_object)
        console.log("reciever_object" , receiver_object)
   
        let receiver_device_token = "";
        let receiver_name = "";
        let is_notification_reciever = " ";
        let receiver_id = " ";

        for (let i = 0; i < receiver_object.length; i++) {
            receiver_device_token = receiver_object[i].user_device_token;
            receiver_name = receiver_object[i].full_name;
            receiver_id = receiver_object[i]._id;
            //  is_notification_reciever = receiver_object[i].is_notification;
        }


        let sender_name = "";
        let sender_image = "";
        let sender_id = "";



        for (let i = 0; i < sender_object.length; i++) {
            //  sender_device_token = sender_object[i].user_device_token;
            sender_name = sender_object[i].hospital_name;
            sender_image = sender_object[i].hospital_Image;
            sender_id = sender_object[i]._id;
        }


        const notification_obj_receiver = {
            user_device_token: receiver_device_token,
            title: receiver_name,
            body: `${sender_name} has approve your shift.`,
            notification_type: "Shift_approve_notify",
            vibrate: 1,
            sound: 1,
            sender_id: sender_id,
            sender_name: sender_name,
            sender_image: sender_image,
            receiver_id: receiver_id
        };


        push_notifications(notification_obj_receiver);


        const notification = new Notification({
            user_device_token: notification_obj_receiver.user_device_token,
            title: notification_obj_receiver.title,
            body: notification_obj_receiver.body,
            notification_type: notification_obj_receiver.notification_type,
            sender_id: notification_obj_receiver.sender_id,
            sender_name: notification_obj_receiver.sender_name,
            sender_image: notification_obj_receiver.sender_image,
            receiver_id: notification_obj_receiver.receiver_id,
            date: moment(new Date()).format('YYYY-MM-DD')
        })
        await notification.save()


        // push_notification(approveJob)

        if (notification) {

            return res.status(200).send({
                status: 1,
                message: "success",
                approveJob,
            });
        } else {
            return res.status(400).json({ status: 0, msg: "Something went wrong" })
        }

    } catch (error) {

        console.log(error.message)
        return res.status(500).json({ error: error.message })
    }
}

const findJobs = async (req, res) => {
    try {

        const allJobs = await Job.find().populate("hospital_id", "hospital_name job_title job_timing hourly_rate hospital_Image location job_location")
        if (allJobs.length < 0) {
            return res.status(400).json({ status: 0, msg: "No Jobs Found" })
        } else {
            return res.status(200).json({ status: 1, msg: "Jobs Available", jobs: allJobs })
        }
    } catch (error) {
        console.log(error.message)
        return res.status(500).json({ error: error.message })
    }
}



const findMyJobs = async (req, res) => {
    try {
        const myJobs = await Job.find({ user_id: req.payload._id }).populate("hospital_id", "hospital_name job_title job_timing hourly_rate hospital_Image location job_location")
        if (myJobs.length < 0) {
            return res.status(400).json({ status: 0, msg: "You did not apply for any job" })
        } else {
            return res.status(200).json({ status: 1, msg: "Your Job shifts", jobs: myJobs })
        }

    } catch (error) {

        console.log(error.message)
        return res.status(500).json({ error: error.message })
    }
}


const myPreviousShifts = async (req, res) => {
    try {
        const date = Date.now()
        let currentDate = new Date();
        let date_ob = new Date();
        const newData = moment(Date.now()).format("YYYY-MM-DD");



        // const myShifts = await Job.find({ user_id: req.payload._id, approve: true, createdAt: { $lte: date } }).populate("hospital_id")
        const myShifts = await Job.find({
            $and: [
                { user_id: req.payload._id },
                { approve: true },
                { date: { $lt: newData } }
            ]
        }).populate("hospital_id")

        if (myShifts.length < 0) {
            return res.status(400).json({ status: 0, msg: "No shift Found" })
        } else {
            var output = [];
    for (var i=0; i < myShifts.length ; ++i){
        output.push(myShifts[i].hospital_id);
    }
            return res.status(200).json({ status: 1, msg: "List of Jobs", jobs: output })
        }

    } catch (error) {
        console.log(error.message)
        return res.status(500).json({ error: error.message })

    }
}


const myComingShifts = async (req, res) => {
    try {
        const date = Date.now()
        const newData = moment(Date.now()).format("YYYY-MM-DD");
        const myShifts = await Job.find({
            $and: [
                { user_id: req.payload._id },
                { approve: true },
                { date: { $gt: newData } }
            ]
        }).populate("hospital_id")
        // const myShifts = await Job.find({ user_id: req.payload._id, approve: true, createdAt: { $gte: date } })
        if (myShifts.length < 0) {
            return res.status(400).json({ status: 0, msg: "No shift Found" })
        } else {
            var output = [];
    for (var i=0; i < myShifts.length ; ++i){
        output.push(myShifts[i].hospital_id);
    }
            return res.status(200).json({ status: 1, msg: "List of Jobs", jobs: output })
        }
    } catch (error) {
        console.log(error.message)
        return res.status(500).json({ error: error.message })

    }
}



const currentJob = async (req, res) => {
    try {
        const date = Date.now()
        const newData = moment(Date.now()).format("YYYY-MM-DD");

        const myShifts = await Job.find({
            $and: [
                { user_id: req.payload._id },
                { approve: true },
                { date: { $eq: newData } }
            ]
        }).populate("hospital_id")
        if (myShifts.length < 0) {
            return res.status(400).json({ status: 0, msg: "No shift Found" })
        } else {
            var output = [];
    for (var i=0; i < myShifts.length ; ++i){
        output.push(myShifts[i].hospital_id);
    }
            return res.status(200).json({ status: 1, msg: "List of Jobs", jobs: output })
        }
    } catch (error) {
        console.log(error.message)
        return res.status(500).json({ error: error.message })

    }
}

const getHospitalDetail = async (req, res) => {
    try {
        const id = req.params.id
        const hospital = await Hospital.findOne({ _id: id })
        if (hospital) {
            return res.status(200).json({ status: 1, msg: "Detail of Shift", data: hospital })
        } else {
            return res.status(400).json({ status: 0, msg: "Something went wrong" })

        }
    } catch (error) {

        console.log(error.message)
        return res.status(500).json({ error: error.message })
    }
}



const getNotification = async (req, res) => {
    try {

        const not = await Notification.find({ receiver_id: req.payload._id })
        if (not.length > 1) {
            // return 
            return res.status(200).json({ status: 1, msg: "Notifications", notification: not })
        } else {
            return res.status(400).json({ status: 0, msg: "No Notification Found" })

        }
    } catch (error) {
        console.log(error.message)
        return res.status(500).json({ error: error.message })
    }
}



module.exports = { postShift, applyJob, approveJobRequest,getNotification, findJobs, findMyJobs, myPreviousShifts, myComingShifts,viewAllJob,getHospitalDetail,currentJob }