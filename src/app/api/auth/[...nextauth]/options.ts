//one of the two main files for next-auth
import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs"
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";


export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      id: "credentials",
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials: any): Promise<any> {
        await dbConnect()
        try {
          const user = await UserModel.findOne({
            $or: [
              { email: credentials.identifier },
              { username: credentials.identifier }
            ]
          })

          if (!user) {
            throw new Error("No user found with this email")
          }

          if (!user.isVerified) {
            throw new Error("Please verify your account first")
          }

          const isPasswordCorrect = await bcrypt.compare(credentials.password, user.password)

          if (isPasswordCorrect) {
            //authoptions ko return karke usko control dega
            return user
          } else {
            throw new Error("Incorrect Password")
          }
        } catch (err: any) {
          throw new Error(err)
        }
      }
    })
    //agar dusra konsa provider add karna hai toh u can do here just by putting a comma
  ],
  //callbacks are used to not use the database query and just take the info from token
  callbacks: {
    //user ki info token me share kardi
    async jwt({ token, user }) {
      if(user){
        token._id = user._id?.toString()
        token.isVerified = user.isVerified
        token.isAcceptingMessages = user.isAcceptingMessages;
        token.username = user.username
      }

      return token
    },
    //token ki info session me jaakar user object bhar kar usme values share kardi
    async session({ session, token }) {
      if(token){
        session.user._id = token._id
        session.user.isVerified = token.isVerified
        session.user.isAcceptingMessages = token.isAcceptingMessages
        session.user.username = token.username
      }
      return session
    },
  },
  pages: {
    signIn: '/sign-in',
  },
  session: {
    strategy: "jwt"
  },
  secret: process.env.NEXTAUTH_SECRET,



}