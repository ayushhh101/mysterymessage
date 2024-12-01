import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import bcrypt from "bcryptjs";
import { sendVerificationEmail } from "@/helpers/sendVerificationEmail";

// IF existingUserByEmail THEN
//    IF existingUserByEmail.isVerified THEN
//      success FALSE 
// ELSE
//    SAVE THE NEW UPDATED USER (password vagera change hogaya toh )
// END IF 
//
// ELSE 
//    CREATE A NEW USER with given details
//    Save the new user
// END IF

export async function POST(request: Request) {
  await dbConnect()

  try {
    const { username, email, password } = await request.json()

    //checks from database if the user already exists 
    const exisitingUserVerifiedByUsername = await UserModel.findOne({
      username,
      isVerified: true
    })

    if (exisitingUserVerifiedByUsername) {
      return Response.json({
        success: false,
        message: "Username is already Taken !"
      }, { status: 400 })
    }

    //Gets the User by mail
    const exisitingUserByEmail = await UserModel.findOne({ email })
    //Generates an OTP/verifycode
    const verifyCode = Math.floor(100000 + Math.random() * 900000).toString()

    //Checks if user already exists (through email) and is verified 
    if (exisitingUserByEmail) {
      if(exisitingUserByEmail.isVerified){
        return Response.json({
          success: false,
          message: "User already exists with this email"
        }, { status: 400 })
      }
      //If not verified new password , otp/verifycode is send 
      else{
        const hassedPassword = await bcrypt.hash(password, 10)
        exisitingUserByEmail.password = hassedPassword;
        exisitingUserByEmail.verifyCode = verifyCode;
        exisitingUserByEmail.verifyCodeExpiry = new Date(Date.now()+ 3600000);
        await exisitingUserByEmail.save()
      }
    } 
    
    //creating a WHOLE new user
    else {
      const hassedPassword = await bcrypt.hash(password, 10)
      const expiryDate = new Date();
      expiryDate.setHours(expiryDate.getHours() + 1)

      const newUser = new UserModel({
        username,
        email,
        password: hassedPassword,
        verifyCode,
        verifyCodeExpiry: expiryDate,
        isVerified: false,
        isAcceptingMessage: true,
        messages: []
      })

      await newUser.save()
    }

    //Send Verification Email
    const emailResponse = await sendVerificationEmail(
      email,
      username,
      verifyCode
    )

    //api response gives .success in return
    if (!emailResponse.success) {
      return Response.json({
        success: false,
        message: emailResponse.message
      }, { status: 500 })
    }

    return Response.json({
      success: true,
      message: "User Registered Successfully . Please verify your email"
    }, { status: 201 })

  } catch (error) {
    //response in terminal
    console.error("Error registering user", error)
    //response in frontend
    return Response.json(
      {
        success: false,
        message: "Error registering user"
      },
      {
        status: 500
      }
    )
  }
}