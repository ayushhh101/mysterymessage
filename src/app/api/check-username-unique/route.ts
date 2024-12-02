//zod is used here
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import { z } from "zod"
import { usernameValidation } from "@/schemas/signUpSchema";

//query schema
const UsernameQuerySchema = z.object({
  username: usernameValidation
})

//jab use type kar raha hoga tabhi usko batana ki username available hai ki nhi
export async function GET(request: Request) {
 
  await dbConnect()

  try {
    //pura url le lena
    const {searchParams} = new URL(request.url)
    //zod ke docs se
    const queryParam ={
      username: searchParams.get('username')
    }
    //validate with zod //agar parsing safe hui toh result me store hoga
    const result =  UsernameQuerySchema.safeParse(queryParam)
    console.log(result) //TODO:remove
    if(!result.success){
      //only taking username errors
      const usernameErrors = result.error.format().username?._errors || []
      return Response.json({
        success:false,
        message: usernameErrors?.length>0 ? usernameErrors.join(', '): "Invalid query parameters"
      },{status:400})
    }

    const {username} = result.data

    const exisitingVerifiedUser =await UserModel.findOne({username, isVerified: true})

    if(exisitingVerifiedUser){
      return Response.json({
        success:false,
        message: 'Username is already Taken'
      },{status:400})
    }

    return Response.json({
      success:true,
      message: 'Username is available'
    },{status:400})

  } catch (error) {
    console.error("Error Checking Username", error)
    return Response.json(
      {
        success: false,
        message: "Error checking username"
      },
      {status: 500}
    )
  }
}