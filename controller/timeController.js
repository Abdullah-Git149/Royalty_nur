const Timesheet = require("../model/TimeSheet")
const moment = require("moment")
const Hospital = require("../model/Hospital")


// const timeSheet = async (req, res) => {
//     try {
//         if (!req.body.clockIn) {
//             return res.status(400).json({ status: 0, msg: "ClockIn required" })
//         } else if (!req.body.clockOut) {
//             return res.status(400).json({ status: 0, msg: "ClockIn required" })
//         } else {

//             const time = await Timesheet({
//                 clockIn: req.body.clockIn,
//                 clockOut: req.body.clockOut,
//                 user_id: req.payload._id,
//                 hospital_id: req.body.hospital_id
//             })


//             await time.save()

//             return res.status(201).json({ status: 1, msg: "Success", time: time })
//         }


//     } catch (error) {
//         return res.status(500).json({ error: error.message })
//     }
// }


// OLD CODE
// const clockInClockOut = async (req, res) => {
//     try {
     
//         const date =    moment(new Date()).format("HH:MM:SS")
//         const hospital = await Hospital.findById({ _id: req.body.hospital_id });
//         const findCheck = await Timesheet.findOne({ user_id: req.payload._id, hospital_id: req.body.hospital_id });
//         if (!findCheck) {



//             const time = new Timesheet

//             time.date = hospital.date
//             time.clockIn = date
//             time.hospital_id = req.body.hospital_id
//             time.user_id = req.payload._id

//             await time.save()

//             return res.status(200).send({ status: 1, message: "Check In Successfull", time });

//         } else if (findCheck.clockOut === null) {
         

//             const updateTime = await Timesheet.findOneAndUpdate({ user_id: req.payload._id, hospital_id: req.body.hospital_id }, { clockOut: date }, { new: true })
//             if (updateTime) {
//                 return res.status(200).json({ status: 1, msg: "Successfully Check Out", updateTime: updateTime })
//             } else {
//                 return res.status(400).json({ status: 0, msg: "Something went wrong" })

//             }

//         }else {
//             return res.status(400).json({ status: 0, msg: "You have already done this job" })
//         }

//     } catch (error) {
//         console.log(error.message)
//         return res.status(500).json({ error: error.message })
//     }
// }



//NEW

const clockInClockOut = async (req, res) => {
    try {

        const date = moment(new Date()).format("HH:MM:SS")
        const monthYear = moment(new Date()).format("YYYY-MM")
        const monthYearDate = moment(new Date()).format("YYYY-MM-DD")

        // const clockIn = moment(req.body.clockIn).format("hh:mm")
        // const clockOut = moment(req.body.clockOut).format("hh:mm")

        const hospital = await Hospital.findById({ _id: req.body.hospital_id });
        const findCheck = await Timesheet.findOne({ user_id: req.payload._id, hospital_id: req.body.hospital_id });
        if (!findCheck) {



            const time = new Timesheet({
            date:hospital.date,
            // "clock.clockTime" :req.body.clockInTime,
            // "clock.clockType ": req.body.clockInType,
            clock:req.body.clock,
            // "clockOut.clockOutTime" : req.body.clockOutTime,
            // "clockOut.clockOutType" : req.body.clockOutType,
            hospital_id : req.body.hospital_id,
            user_id : req.payload._id,
            monthYearDate :monthYearDate
            })
            // time.date = hospital.date
            // // time.clockIn = req.body.clockIn
            // // time.clockOut = req.body.clockOut
            // time.clockIn.clockInTime = req.body.clockInTime
            // time.clockIn.clockInType = req.body.clockInType
            // time.clockOut.clockOutTime = req.body.clockOutTime
            // time.clockOut.clockOutType = req.body.clockOutType
            // time.hospital_id = req.body.hospital_id
            // time.user_id = req.payload._id
            // // time.monthYear = monthYear
            // time.monthYearDate =monthYearDate

            await time.save()

            return res.status(200).send({ status: 1, message: "Successfully", time });

        } else {


            const checkInObj = { clockIn: req.body.clockIn }
            const checkOutObj = { clockOut: req.body.clockOut }
            // const updateTime = await Timesheet.findOneAndUpdate({ user_id: req.payload._id, hospital_id: req.body.hospital_id }, { $push:{clockIn: req.body.clockIn ,clockOut: req.body.clockOut} }, { new: true }).populate("hospital_id")
            const updateTime = await Timesheet.findOneAndUpdate({ user_id: req.payload._id, hospital_id: req.body.hospital_id }, { $push: {clock:req.body.clock} }, { new: true }).populate("hospital_id")
            if (updateTime) {
                return res.status(200).json({ status: 1, msg: "Successfully", updateTime: updateTime })
            } else {
                return res.status(400).json({ status: 0, msg: "Something went wrong" })

            }

        }

    } catch (error) {
        console.log(error.message)
        return res.status(500).json({ error: error.message })
    }
}



const listOfTimeSheet = async (req, res) => {
    try {


        const abc = moment(Date.now()).format('YYYY-MM-DD')
        // console.log(abc)

        const date = req.params.date
        const timeSheet = await Timesheet.find({ user_id: req.payload._id, monthYearDate:date }).populate("hospital_id")
console.log(date)
        if (timeSheet.length < 0) {
            return res.status(400).json({ status: 0, msg: " No List Found" })
        } else {
            return res.status(200).json({ status: 1, msg: "List of TimeSheet", sheet: timeSheet })
        }


    } catch (error) {

        console.log(error.message)
        return res.status(500).json({ error: error.message })
    }
}


module.exports = { clockInClockOut, listOfTimeSheet }