//sendOTP
const User = require("../models/User");
const OTP = require("../models/OTP");
const otpGenerator = require("otp-generator");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const Profile = require("../models/Profile");
require("dotenv").config();
const mailSender = require("../utils/mailSender");
const { passwordUpdated } = require("../mail/templates/passwordUpdate");

exports.sendOTP = async(req,res)=>{
   try{
        //fetch email from request body
        const {email}=req.body;

        //check if user already exist
        const checkUserPresent = await User.findOne({email});
        
        //If user alredy exist,then return a response
        if(checkUserPresent){
            return res.status(401).json({
                success:false,
                message:'User already registered',
            })
        }

        //generate OTP
        var otp = otpGenerator.generate(6,{
            upperCaseAlphabets:false,
            lowerCaseAlphabets:false,
            specialChars:false,
        });
        console.log("OTP generated: ",otp);

        //check unique otp or not
        const result = await OTP.findOne({otp:otp});
        while(result){
            otp = otpGenerator.generate(6,{
            upperCaseAlphabets:false,
            lowerCaseAlphabets:false,
            specialChars:false,
            });
            result = await OTP.findOne({otp:otp});

        }
        const otpPayload = {email,otp};
        //create an entry for OTP
        const otpBody = await OTP.create(otpPayload);
        console.log(otpBody);

        //return response successfully
        res.status(200).json({
            success:true,
            message:'OTP Sent Successfuly',
            otp,
        })

    }
    catch(error){
        console.log(error);
        return res.status(500).json({
            success:false,
            message:error.message,
        })
    }



}


//signUp

exports.signUp = async(req,res)=>{
   try{
         //data fetch from request body
        const{
            firstName,
            lastName,
            email,
            password,
            confirmPassword,
            accountType,
            contactNumber,
            otp
            } = req.body;
        
        //validation
        if(!firstName|| !lastName ||!email || !password ||!confirmPassword ||!otp){
            return res.status(403).json({
                success:false,
                message:"All fields are required",
            })

        }
        //2 password match krlo
        if(password!==confirmPassword){
            return res.status(400).json({
                success:false,
                message:'Password and ConfirmPassword value does not match,please try again',

            });
        }
        //check user alredy exist or not
        const existingUser = await User.findOne({email});
        if(existingUser){
            return res.status(400).json({
                success:false,
                message:'User is already registered',
            });

        }
        //find most recent otp stored for the user
        const recentOtp = await OTP.find({email}).sort({createdAt:-1}).limit(1);
        console.log(recentOtp);
        //validate otp
        if(recentOtp.length==0){
            //otp not found
            return res.status(400).json({
                success:false,
                message:'OTP not found',
            })
        } else if(otp!==recentOtp[0].otp){
            //Invalid otp
            return res.status(400).json({
                success:false,
                message:"Invalid OTP",
            });
        }
        //hash password
        const hashedPassword  = await bcrypt.hash(password,10);
        //entry create in DB
        const profileDetails = await Profile.create({
            gender:null,
            dateofBirth:null,
            about:null,
            contactNumber:null,
        })
        const user = await User.create({
            firstName,
            lastName,
            email,
            contactNumber,
            password:hashedPassword,
            accountType,
            additionalDetails:profileDetails._id,
            image:`https://api.dicebear.com/5.x/initials/svg?seed=${firstnName} ${lastname} `,

        })
        //return res
        return res.status(200).json({
            success:true,
            message:'User is registered Successfully',
            user
        });
        
    
    }
   catch(error){
    console.log(error);
    return res.status(500).json({
        success:false,
        message:"User cannot be registered.plese try again",
    })

   }
    
}
//login      
exports.login= async (req,res)=>{
    try{

        //get data from req body
        const {email,password}=req.body;
        //validate kro
        if(!email || !passoword){
            return res.status(403).json({
                success:false,
                message:'All fields are required,please try again'
            })
        }
        //user check exist or not
        const user = await User.findOne({email}).populate("additionalDetails");
        if(!user){
            return res.status(401).json({
                success:false,
                message:"User is not registered ,please signup first",
            });
        }

        //generate JWT,after password match
        if(await bcrypt.compare(password,user.password)){
            const payload = {
                email:user.email,
                id:user._id,
                accountType:user.accountType,
            }
            const token = jwt.sign(payload,process.env.JWT_SECRET,{
                expiresIn:"2h",
            });
            user.token = token;
            user.password = undefined;
        
            //create cookies and send response
            const options ={
                expires:new Date(Date.now() + 3*60*60*1000),
                httpOnly:true,//no client side changes
            }
            res.cookie("token",token,options).status(200).json({
                success:true,
                token,
                user,
                message:'Logged in Successfully',
            })
        }
        else{
            return res.status(401).json({
                success:false,
                message:'Password is incorrect',
            })
        }


         
    }
    catch(error){
        console.log(error);
        return res.status(500).json({
            success:false,
            message:'Login failure ,please try again'
        });

    }

}

//change password
//HW?
exports.changepassword = async(req,res)=>{
     return res.status(501).json({
        success: false,
        message: "Change password is not implemented yet",
    });
    //get data from req body
    //get oldPassword,newPassword,confirmPassword
    //validation
    //update pwd in databbse
    //send mail-password updated
    //return response 

}
