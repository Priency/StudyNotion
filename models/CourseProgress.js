const mongoose = require("mongoose");

const courseProgess = new mongoose.Schema({
    courseID:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Course",
    },
    completedVidoes:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:"SubSection",
        }
    ]

    
    
});
module.exports = mongoose.model("CourseProgress" ,courseProgress);

