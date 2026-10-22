const SubSection = require("../models/SubSection");
const Section = require("../models/Section");
const { uploadImageToCloudinary } = require("../utils/imageUploader");
//create SubSection
exports.createSubSection = async(req,res)=>{
    try{
        //fetch data from request body
        const {sectionId,title,timeDuration,description} = req.body;
        //extract file/video
        const video = req.files.videoFile;
        //validation
        if(!sectionId || !title || !timeDuration ||!description || !video){
            return res.status(400).json({
                success:false,
                message:"All fiels are required",
            });


        }
        //upload video to cloudinary
        const uploadDetails =await uploadImageToCloudinary(video,process.env.FOLDER_NAME);
        //create A sub section
        const SubSectionDetails = await SubSection.create({
            title:title,
            timeDuration:timeDuration,
            description:description,
            videoUrl:uploadDetails.secure_url,
        }) 
        //update section with this subsection objectidd
        const updatedSection = await Section.findByIdAndUpdate({_id:sectionId},
                                                    {$push:{
                                                        subSection:SubSectionDetails._id,

                                                    }},
                                                    {new:true});
        //HW:log updated section here,after adding populate query
        //return response
        return res.status(200).json({
            success:true,
            message:'Sub section Created Successfully',
            updatedSection,
        });


        



    }
    catch(error){
        return res.status(500).json({
            success:false,
            message:"Internal sever error ",
            error:error.message,


        })

    }
};
//HW :UpdatedSubSection 
//HW :Delete SubSection

exports.updateSubSection = async (req, res) => {
    try {
        const { subSectionId, title, timeDuration, description } = req.body;

        if (!subSectionId) {
            return res.status(400).json({
                success: false,
                message: "SubSection ID is required",
            });
        }

        const updatedSubSection = await SubSection.findByIdAndUpdate(
            subSectionId,
            { title, timeDuration, description },
            { new: true, runValidators: true }
        );

        if (!updatedSubSection) {
            return res.status(404).json({
                success: false,
                message: "SubSection not found",
            });
        }

        return res.status(200).json({
            success: true,
            message: "SubSection updated successfully",
            updatedSubSection,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Unable to update SubSection",
            error: error.message,
        });
    }
};

exports.deleteSubSection = async (req, res) => {
    try {
        const { subSectionId, sectionId } = req.body;

        if (!subSectionId || !sectionId) {
            return res.status(400).json({
                success: false,
                message: "SubSection ID and Section ID are required",
            });
        }

        const deletedSubSection = await SubSection.findByIdAndDelete(
            subSectionId
        );

        if (!deletedSubSection) {
            return res.status(404).json({
                success: false,
                message: "SubSection not found",
            });
        }

        const updatedSection = await Section.findByIdAndUpdate(
            sectionId,
            { $pull: { subSection: subSectionId } },
            { new: true }
        );

        return res.status(200).json({
            success: true,
            message: "SubSection deleted successfully",
            updatedSection,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Unable to delete SubSection",
            error: error.message,
        });
    }
};

