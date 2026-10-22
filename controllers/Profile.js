const Profile = require("../models/Profile");
const User = require("../models/User");
//for additional detail,we have alredy created and placed with NUll,now we update its value
exports.updateProfile = async(req,res)=>{
    try{
        //get data
        const {dateOfBirth="",about="",contactNumber,gender} = req.body;


        //get UserId
        const id = req.user.id;//decode in user and decode is  payload
        //validation
        if(!contactNumber || !gender || !id){
            return res.status(400).json({
                success:false,
                message:'All fields are required',
            });
        }
        //find profile
        const userDetails = await User.findById(id);
        const profileId = userDetails.additionalDetails;
        const profileDetails = await Profile.findById(profileId);

        //update profile
        profileDetails.dateOfBirth=dateOfBirth;
        profileDetails.about = about;
        profileDetails.gender = gender;
        profileDetails.contactNumber=contactNumber;
        await profileDetails.save();//save for update,create for creation


        //return response
        return res.status(200).json({
            success:true,
            message:"profile updated successfully",
            profileDetails,

        });
    }
    catch(error){
        return res.status(500).json({
            success:false,
            error:error.message,

        });

    }
};
exports.deleteAccount= async(req,res)=>{
    try{
        //get id
        const id =req.user.id;
        //validation
        const userDetails = await User.findById(id);
        if(!userDetails){
            return res.status(404).json({
                success:false,
                message:"user not found",
            });
        }

        //delete Profile
        await Profile.findByIdAndDelete({_id:userDetails.additionalDetails});

        //delete user
        await User.findByIdAndDelete({_id:id});
        //HW Unenrolled user from all enrolled courses
        //return response
        return res.status(200).json({
            success:true,
            message:'user Deleted SuccessFully',
        });

       


    }
    catch(error){
        return res.status(500).json({
            success:false,
            message:"User cannot be deleted Succesfully",
           
        });

    }

}

//get user details
exports.getAllUserDetails = async(req,res)=>{
    try{
        //get id
        const id = req.user.id;
        //validation and get User details
        const userDetails = await User.findById(id).populate("additionalDetails").exec();

        //return responnse
        return res.status(200).json({
            success:true,
            message:'user data fetched successfully',
        });

    }
    catch(error){
        return res.status(500).json({
            success:false,
            message:error.message,
        });

    }
}
exports.updateDisplayPicture = async (req, res) => {
    return res.status(501).json({
        success: false,
        message: "Update display picture is not implemented yet",
    });
};

exports.getEnrolledCourses = async (req, res) => {
    return res.status(501).json({
        success: false,
        message: "Get enrolled courses is not implemented yet",
    });
};

