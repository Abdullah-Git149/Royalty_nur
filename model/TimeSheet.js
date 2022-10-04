const mongoose = require('mongoose')
const moment = require("moment")

const timesheetSchema = new mongoose.Schema({
//   clockIn: {
//         type: String,
//         // default: (new Date()).getTime()
//         default: null
//     },
//     clockOut: {
//         type: String,
//         // default: (new Date()).getTime()
//         default: null
//     },
    
    
    
    // clockIn: [{

    //     type: String,
    //     // default: (new Date()).getTime()
    //     default: null
    // }
    // ],
    // clockOut: [{
    //     type: String,
    //     // default: (new Date()).getTime()
    //     default: null
    // }],
    
    
     clock: [{

        clockTime: { type: String, default: null },
        clockType: { type: String, default: null },
    }],



    
    // clockOut: [{
    //     clockOutTime: { type: String, default: null },
    //     clockOutType: { type: String, default: null },
    // }],
    
    
    
    date:{
        type: Date,
        default: moment(new Date()).format("YYYY-MM-DD")
    },
    monthYear:{
        type: String,
        default: moment(new Date()).format("YYYY-MM")
    },
    monthYearDate: {
        type: String,
        default: moment(new Date()).format("YYYY-MM-DD")
    },
    day: {
        type: String,
        enum: ["mon", "tues", "wed", "thurs", "fri", "sat", "sun"],
        default: "mon"
    },
    user_id:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    hospital_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Hospital'
    }
},
    { timestamps: true }
);

const Timesheet = mongoose.model("Timesheet", timesheetSchema); 


module.exports = Timesheet;