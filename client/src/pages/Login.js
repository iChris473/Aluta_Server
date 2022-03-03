
import logo from "../assets/aluta_logo.png"
import {useContext, useRef} from "react"
import { Link } from "react-router-dom"
import { AuthContext } from "../context/AuthContext"
import { loginCall } from "../ApiCalls"

export default function Login() {

  const {user, isFetching, error, dispatch, payload} = useContext(AuthContext)
  const email = useRef()
  const password = useRef()
  
  const handleSubmit = e => {
    e.preventDefault();
    loginCall({email:email.current.value, password:password.current.value}, dispatch)

  }
  
  return (
    <div className="bg-gray-100 h-screen relative">
      <div className=" absolute w-full transform left-1/2 top-1/3 -translate-x-1/2 -translate-y-1/2 rounded-md">
          <div className="flex flex-col items-center">
              <div className="relative">
                <img src={logo} className="sm:h-60 h-40 object-contain" alt="" />
                <p className="text-center bottom-4 sm:bottom-5 absolute transform left-1/2 -translate-x-1/2 -translate-y-1/2 font-bold text-sm sm:text-xl text-gray-600 w-full">Sign In to your account</p>
              </div>
            <div className="border bg-white p-5 shadow-2xl z-20 w-5/6 sm:w-2/3 max-w-lg">
                <form onSubmit={handleSubmit} className="flex flex-col gap-2 items-center justify-center">
                    <input required 
                    className="border border-gray-200 rounded-md focus:ring-0 focus:border-gray-400 text-xs w-full" 
                    ref={email}  type="email" placeholder="email" />
                    <input required 
                    ref={password}
                    className="border text-xs border-gray-200 rounded-md focus:ring-0 focus:border-gray-400 w-full" type="password" placeholder="password" />
                    {
                      error && <p className="text-sm bg-red-400 px-3 py-1 w-full text-center font-semibold text-white rounded-md">check your credentials</p>
                    }
                    <button 
                    disabled={isFetching}
                    type="submit" className="w-full bg-green-500 rounded-md p-2 text-white font-bold cursor-pointer disabled:cursor-not-allowed">{isFetching ? "signing in..." : "Sign In"}</button>
                    <Link to="/register">
                    <p  className="w-full  p-2 text-black font-semibold">Register</p>
                    </Link>
                </form>
            </div>
          </div>
      </div>
    </div>
  )
}
