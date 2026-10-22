const Section = require("../models/Section");
const Course = require("../models/Course");

exports.createSection = async(req,res)=>{
    try{
        //data fetch
        const {sectionName, courseId} = req.body;
        //Data validation
        if(!sectionName || !courseId){
            return res.status(400).json({
                success:false,
                message:"Missing properties",

            });
        }
        //create section
        const newSection = await Section.create({sectionName}); 
         
        //update course with section objectId
        const updateCourseDetails = await Course.findByIdAndUpdate(
                                            courseId,
                                            {
                                                $push:{
                                                    CourseContent:newSection._id,

                                                }
                                            },
                                            {new:true},//reflect all the changes happened currently

        )
        //HW:Use populate to replace section/sub section both in the updatedCourseDetails instead of object id

        //return response
        return res.status(200).json({
            success:true,
            message:'Section created successfully',
            updateCourseDetails
        })


    }
    catch(error){
        return res.status(500).json({
            success:false,
            message:"Unable to create section,please try again",
            error:error.message,
        });

    }
};
exports.updateSection = async(req,res)=>{
    try{
        //data input
        const {sectionName,sectionId} = req.body;
        //data validation
        if(!sectionName || !sectionId){
            return res.status(400).json({
                success:false,
                message:"Missing properties"

            });
        }
        //update data
        const section = await Section.findByIdAndUpdate(sectionId,{sectionName},{new:true});

        //return res
         return res.status(200).json({
            success:true,
            message:'Section updated successfully',
            
        })


    }
    catch(error){
         return res.status(500).json({
            success:false,
            message:"Unable to update section,please try again",
            error:error.message,
        });

    }
};

exports.deleteSection = async(req,res)=>{
    try{
        //get ID-assuming that we are sending ID in params
        const {sectionId} = req.params
        //use findByIdandDelete
        await Section.findByIdAndDelete(sectionId);
        //TODO:do we need to delete the section id from course schema course content too?

        //return response
        return res.status(200).json({
            success:true,
            message:"Section Deleted Successfully",
        })

    }
    catch(error){
        return res.status(500).json({
            success:false,
            message:"Unable to delete section,please try again",
            error:error.message,

        });
    }
}