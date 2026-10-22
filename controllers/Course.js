const Course =require("../models/Course");
const Tag = require("../models/Category");
const User = require("../models/User");
const {uploadImageToCloudinary} = require("../utils/imageUploader");

//create course handler function
exports.createCourse = async(req,res)=>{
    try{
        //fetch data
        const {courseName,courseDescription,whatYouWillLearn,price,tag}=req.body;
        //get thumbnail
        const thumbnail = req.files.thumbnailImage;
        //validation
        if(!courseName || !courseDescription || !whatYouWillLearn || !price || !tag || !thumbnail){
            return res.status(400).json({
                success:false,
                message:"All fields are required",

            });
        }
        //check for instructor
        //TODO:verify user id and instructorDetails._id are same or diffeernt
        const userId = req.user.id;
        const instructorDetails = await User.findById(userId);
        console.log("Instructor Details:",instructorDetails);
        if(!instructorDetails){
            return res.status(404).json({
                success:false,
                message:'Instructor Details not found',
            });

        }
        //check given tag is valid or not
        const tagDetails = await Tag.findById(tag);//tag object id tag schema isliye id se fetch kia h
        if(!tagDetails){
            return res.status(404).json({
            success:false,
            message:'Tag Details not found',
            });

        }

        //Upload image to cloudinary
        const thumnailImage = await uploadImageToCloudinary(thumbnail,process.env.FOLDER_NAME);
        //create an entry for new course
        const newCourse = await Course.create({
            CourseName,
            courseDescription,
            instructor:instructorDetails._id,
            whatYouWillLearn:whatYouWillLearn,
            price,
            tag:tagDetails._id,
            thumbnail:thumbnailImage.secure_url,
        })

        //add the new course to the user schema of instructor
        await User.findByIdAndUpdate(
            {_id:instructorDetails._id},
            {
                $push:{
                    courses:newCourse._id,
                }
            },
            {new:true},
        )
        //update the tag schema-HW
        //Todo:hw

        //return response
        return res.status(200).json({
            success:true,
            message:"course created successfully",
            data:newCourse,
        });





    }
    catch(error){
        console.log(error);
        return res.status(500).json({
            success:false,
            messagge:"failed to create course",
            error:error.message,
        })

    }
};

//getAllcourses handler function

exports.showAllCourses = async(req,res)=>{
    try{
        //tODO-change below code
        const allCourses = await Course.find({},{courseName:true,
                                                price:true,
                                                thumbnail:true,
                                                instructor:true,
                                                ratingAndReviews:true,
                                                studentsEnrolled:true,})
                                                .populate("instrutor")
                                                .exec();

        return res.status(200).json({
            success:true,
            message:"Data for all courses fetched successfully",
            data:allCourses,
        })
        


    }
    catch(error){
        console.log(error);
        return res.status(500).json({
            success:false,
            messsage:'Cannot fetch course data',
            error:error.message,
        })

    }

}
exports.getCourseDetails = async (req, res) => {
    try {
        const { courseId } = req.body;

        if (!courseId) {
            return res.status(400).json({
                success: false,
                message: "Course ID is required",
            });
        }

        const courseDetails = await Course.findById(courseId)
            .populate({
                path: "instructor",
                populate: {
                    path: "additionalDetails",
                },
            })
            .populate("tag")
            .populate("courseContent")
            .exec();

        if (!courseDetails) {
            return res.status(404).json({
                success: false,
                message: "Course not found",
            });
        }

        return res.status(200).json({
            success: true,
            message: "Course details fetched successfully",
            data: courseDetails,
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Unable to fetch course details",
            error: error.message,
        });
    }
};