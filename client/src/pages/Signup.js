
import { useContext ,useRef } from "react"
import { Link } from "react-router-dom"
import { signupCall } from "../ApiCalls"
import { AuthContext } from "../context/AuthContext"

import logo from "../assets/aluta_logo.png"

export default function Signup() {
  
  const {user, isFetching, error, dispatch} = useContext(AuthContext)
  const username = useRef()
  const email = useRef()
  const password = useRef()
  const confirmPassword = useRef()

  
  const handleSubmit = e => {
    e.preventDefault();
    if(password.current.value != confirmPassword.current.value){
        confirmPassword.current.setCustomValidity("Passwords does not match")
    } else{
      console.log({username:username.current.value, email:email.current.value, password:password.current.value})
      signupCall({username:username.current.value, email:email.current.value, password:password.current.value}, dispatch)
    }
  }
  return (
    <div>
          <div className="bg-gray-100 h-screen relative">
      <div className=" absolute w-full transform left-1/2 top-1/3 -translate-x-1/2 -translate-y-1/2 rounded-md">
          <div className="flex flex-col items-center">
              <div className="relative mt-7 sm:mt-9">
                <img src={logo} className="sm:h-60 h-40 object-contain" alt="" />
                <p className="text-center bottom-2 sm:bottom-5 absolute transform left-1/2 -translate-x-1/2 -translate-y-1/2 font-bold text-lg sm:text-xl text-gray-600 w-full">Create an account</p>
              </div>
            <div className="border bg-white p-5 !pb-7 shadow-2xl z-20 w-5/6 sm:w-2/3 max-w-lg">
                <form onSubmit={handleSubmit} className="flex flex-col gap-2 items-center justify-center">
                    <input  required className="border border-gray-200 rounded-md focus:ring-0 focus:border-gray-400 text-xs w-full" ref={username} type="text" placeholder="create a username" />
                    <input ref={email} className="border border-gray-200 rounded-md focus:ring-0 focus:border-gray-400 w-full text-xs" type="email" required placeholder="enter your email" />
                    <input ref={password} className="border text-xs border-gray-200 rounded-md focus:r
                    ing-0 focus:border-gray-400 w-full" type="password" required placeholder="create a password" />
                    <input ref={confirmPassword} className="border text-xs border-gray-200 rounded-md focus:r
                    ing-0 focus:border-gray-400 w-full" type="password" required placeholder="confirm password" />
                    <button type="submit" className="w-full bg-gray-500 rounded-md p-2 text-white font-bold">{isFetching ? "Signing up..." : "Sign Up"}</button>
                    <Link to="/login">
                    <p  className="w-full  p-2 text-black font-semibold">login</p>
                    </Link>
                </form>
            </div>
          </div>
      </div>
    </div>
    </div>
  )
}
