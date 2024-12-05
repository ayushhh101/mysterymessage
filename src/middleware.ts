import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
export { default } from "next-auth/middleware"
import { getToken } from "next-auth/jwt"

// This function can be marked `async` if using `await` inside
export async function middleware(request: NextRequest) {

  const token = await getToken({ req: request })
  const url = request.nextUrl

  // if (token &&
  //   (
  //     //TO FIX : token hai toh sign in/up/verify pe kyu jaarahe ho ?
  //     url.pathname.startsWith('/sign-in') ||
  //     url.pathname.startsWith('/sign-up') ||
  //     url.pathname.startsWith('/verify') ||
  //     url.pathname.startsWith('/')
  //   )
  // ) {
  //   return NextResponse.redirect(new URL('/dashboard', request.url))
  // }
  // if(!token && url.pathname.startsWith('/dashboard')){
  //   return NextResponse.redirect(new URL('/sign-in', request.url));
  // }
  // // return NextResponse.redirect(new URL('/home', request.url))
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: [
    '/sign-in',
    '/sign-up',
    '/',
    //asterisk is used ki jo hi paths /dashboards/blahblahblah aayege waha pe sab use hoga
    '/dashboard/:path*',
    '/verify/:path*'
  ]
}