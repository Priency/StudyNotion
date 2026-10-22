const jwt = require("jsonwebtoken");
require("dotenv").config();
const User = require("../models/User");//user ka model create kia


//auth
exports.auth = async(req,res,next)=>{
    //cookie,body(avoid this),header (header specific way bearer token)
    try{

        //extract token
        const authHeader = req.get("Authorization");

        const token =
        req.cookies?.token ||
        (req.body && req.body.token) ||
        (authHeader?.startsWith("Bearer ")
        ? authHeader.slice(7)
        : null);
        //if token missing,then return response
        if(!token){
            return res.status(400).json({
                success:false,
                message:'Token is missing'
            });
        }
        //verify token
        try{
            const decode =jwt.verify(token,process.env.JWT_SECRET);
            console.log(decode);
            req.user = decode;

        }
        catch(err){
            //verification-issue
            return res.status(401).json({
                success:false,
                message:'Tokein is invalid',
            });

        }
        next();
    }
    catch(error){
        return res.status(401).json({
            success:false,
            message:'Something went wrong while fetching the token'
        });

    }
}

//isstudent
exports.isStudent = async(req,res,next)=>{
    try{
        if(req.user.accountType!=="student"){
            return res.student(401).json({
                success:false,
                message:'This is a protected route for students only',

            });
        }
        next();

    }
    catch(error){
        return res.status(500).json({
            success:false,
            message:'User role cannot be verified,please try again'

        })
    }
}


//isInstructor

exports.isInstructor = async(req,res,next)=>{
    try{
        if(req.user.accountType!=="Instructor"){
            return res.student(401).json({
                success:false,
                message:'This is a protected route for Instructor only',

            });
        }
        next();

    }
    catch(error){
        return res.status(500).json({
            success:false,
            message:'User role cannot be verified,please try again'

        })
    }
}
//isAdmin

exports.isAdmin = async(req,res,next)=>{
    try{
        if(req.user.accountType!=="Admin"){
            return res.student(401).json({
                success:false,
                message:'This is a protected route for Admin only',

            });
        }
        next();

    }
    catch(error){
        return res.status(500).json({
            success:false,
            message:'User role cannot be verified,please try again'

        })
    }
}


