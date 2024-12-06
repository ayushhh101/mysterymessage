import { getServerSession, User } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/options";
import UserModel from "@/model/User";
import { User as NextAuthUser } from "next-auth";
import mongoose from "mongoose";
import dbConnect from "@/lib/dbConnect";

export async function DELETE(request: Request, {params}:{params:{messageid: string}}){
  const messageId = params.messageid
  await dbConnect()

  const session = await getServerSession(authOptions)

  const user: User = session?.user as User

  if(!session || !session.user){
    return Response.json(
      {
        success: false,
        message: "Not authenticated"
      },
      {status: 401}
    )
  }

  try {
    const updateResult = await UserModel.updateOne(
      {_id : user._id},
      {$pull : {messages:{_id : messageId}}}
    )

    if(updateResult.modifiedCount == 0){
      return Response.json(
        {
          success: false,
          message: "Message not found or Already deleted"
        },
        {status: 404}
      )
    }

    return Response.json(
      {
        success: true,
        message: "Message deleted"
      },
      {status: 200}
    )

  } catch (error) {
    console.log("Error in deleting message", error)
    return Response.json (
      {
        success: false,
        message: "Internal server error"
      },
      {status: 500}
    )
  }


}