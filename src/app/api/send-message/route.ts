import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import { Message } from "@/model/User";

export async function POST(request: Request){
  await dbConnect();

  const {username, content}=await request.json()
  try {
    const user = await UserModel.findOne({username})
    if(!user){
      return Response.json(
        {
          success: false,
          message: "User not found"
        },
        {status: 404}
      )
    }

    //is user accepting the messages
    if(!user.isAcceptingMessage){
      return Response.json(
        {
          success: false,
          message: "User is not accepting messages"
        },
        {status: 403}
      )
    }

    const newMessage = {content, createdAt: new Date()}
    //user.messages.push(newMessage) likh toh newMessage pe error dikhaega
    //this is bcoz of typescript, it gives strict instructions ki schema (content) wahi lena jiska type Message ho !
    user.messages.push(newMessage as Message)
    await user.save()

    return Response.json(
      {
        success: true,
        message: "Message send successfully !"
      },
      {status: 403}
    )
    
  } catch (error) {
    console.log("An unexpected error occured : ",error)
    return Response.json(
      {
        success: false,
        message: "Internal server error"
      },
      {status: 500}
    )
  }
}