
import { useContext, useRef, useState } from "react"
import { useRecoilState } from "recoil"
import { settingsModal } from "../atoms/modalAtom"
import { AuthContext } from "../context/AuthContext";
import axios from 'axios'

export default function SettingsModal() {
    const [openSetting, setOpenSetting] = useRecoilState(settingsModal)
    const [editEmail, setEditEmail] = useState(false)
    const [editPassword, setEditPassword] = useState(false)
    const [passwrdSuccess, setPasswrdSuccess] = useState(false)
    const [emailSuccess, setEmailSuccess] = useState(false)
    const [errorMessage, setErrorMessage] = useState(false)
    const [paswrdErrorMessage, setPaswrdErrorMessage] = useState(false)
    const {user, dispatch} = useContext(AuthContext)

    const email = useRef()
    const oldPassword = useRef()
    const newPassword = useRef()
    const confirmPassword = useRef()

    const updatePassword = async e => {
        e.preventDefault()

        const timeOut = () => {
          setTimeout(() => {
            setPasswrdSuccess(false)
            setErrorMessage(false)
            setPaswrdErrorMessage(false)
          }, 3000)
        }  

        const newPasswrd = {
            password: newPassword.current.value,
            userID: user._id
        }

        if (confirmPassword.current.value == newPassword.current.value) {
            try {
                await axios.put(`http://localhost:8800/api/user/update/${user._id}`, newPasswrd)
                setErrorMessage(false)
                setPaswrdErrorMessage(false)
                setPasswrdSuccess(true)
                timeOut()
            } catch (err) {
                        console.log(err)
                        setErrorMessage(true)
                        timeOut()
                }
        } else {
            setErrorMessage(false)
            setPaswrdErrorMessage(true)
            timeOut()
        }
    }
    const updateEmail = async e => {
        e.preventDefault()

        const timeOut = () => {
          setTimeout(() => {
            setEmailSuccess(false)
            setErrorMessage(false)
          }, 3000)
        }  

        const newPasswrd = {
            email: email.current.value,
            password: oldPassword.current.value,
            userID: user._id
        }

        try {
            await axios.put(`http://localhost:8800/api/user/update/${user._id}`, newPasswrd)
            const getUpdatedUser = await axios.get(`http://localhost:8800/api/user/${user._id}`)
            console.log(getUpdatedUser)
            dispatch({type: "LOGIN_SUCCESS", payload:getUpdatedUser.data});
            setErrorMessage(false)
            setEmailSuccess(true)
            email.current.value = ''
            oldPassword.current.value = ''
            timeOut()
        } catch (err) {
            console.log(err)
            setErrorMessage(true)
            timeOut()
        }
    }


  return (
    <div>
        <div onClick={() => setOpenSetting(false)} className="absolute bg-gray-300 opacity-70 w-screen z-10 top-0 h-screen" />
        <div className="bg-white opacity-100 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 rounded-lg z-50 w-[300px] p-5">
            <div className={`gap-3 items-center justify-center ${editEmail || editPassword ? 'hidden' : 'flex'}`}>
                <button onClick={() => setEditEmail(true)} className="hover:border-2 border p-2 text-gray-700 rounded-md cursor-pointer border-red-600">
                  Change Email
                </button>
                  <button onClick={() => setEditPassword(true)} className="hover:scale-110 border text-sm border-blue-600 text-gray-700 cursor-pointer p-2 rounded-md">Change Password
                  </button>
            </div>
            {/* Edit Email or password */}
           {editEmail ? 
                  <form onSubmit={updateEmail} className='flex flex-col'>
                      <div className='w-full flex flex-col'>
                          <p className='text-xs text-green-500 font-semibold'>Enter new email</p>
                          {emailSuccess && <p className='text-xs bg-green-500 p-2 text-white text-center font-semibold'>Email Changed</p>}
                          <input ref={email} requiredtype="email" className='border-none mt-4 outline-none focus:ring-0 text-gray-500 w-full text-xs' placeholder={user.email} />
                          <div className='border-b border-green-500 opacity-40 mt-1' />
                          <input ref={oldPassword} required type="password" className='text-xs border-none outline-none focus:ring-0 text-gray-500 w-full' placeholder='enter password' />
                          <div className='border-b border-green-500 opacity-40 mt-1' />
                      </div>
                      <div className='flex items-center gap-5 justify-end my-3'>
                          <button onClick={() => setEditEmail(false)} className="hover:border-2 border p-1  text-gray-700 rounded-md cursor-pointer border-red-600 text-xs">
                              Cancel
                          </button>
                          <button type='submit' className="hover:scale-110 border bg-green-500 text-white cursor-pointer p-1 text-xs rounded-md">Confirm
                          </button>
                      </div>
                  </form> : editPassword &&
                  <form onSubmit={updatePassword} className='flex flex-col'>
                      <div className=' w-full flex flex-col'>
                          <p className='text-xs text-green-500 font-semibold'>Edit Password</p>
                          {passwrdSuccess && <p className='text-xs bg-green-500 p-2 text-white text-center font-semibold'>Password Changed</p>}
                          {errorMessage && <p className='text-xs bg-red-500 p-2 text-white text-center font-semibold'>An Error occurred</p>}
                          {paswrdErrorMessage && <p className='text-xs bg-red-500 p-2 text-white text-center font-semibold'>Passwords doesnt match</p>}
                          <input ref={oldPassword} required type="password" className='text-xs border-none outline-none focus:ring-0 text-gray-500 w-full' placeholder='enter old password' />
                          <div className='border-b border-green-500 opacity-40 mt-1' />
                          <input ref={newPassword} required type="password" className='text-xs border-none outline-none focus:ring-0 text-gray-500 w-full' placeholder='enter new password' />
                          <div className='border-b border-green-500 opacity-40 mt-1' />
                          <input ref={confirmPassword} required type="password" className='text-xs border-none outline-none focus:ring-0 text-gray-500 w-full' placeholder='confirm new password' />
                          <div className='border-b border-green-500 opacity-40 mt-1' />
                      </div>
                      <div className='flex items-center gap-5 justify-end my-3'>
                          <button onClick={() => setEditPassword(false)} className="hover:border-2 border p-1  text-gray-700 rounded-md cursor-pointer border-red-600 text-xs">
                              Cancel
                          </button>
                          <button type='submit' className="hover:scale-110 border bg-green-500 text-white cursor-pointer p-1 text-xs rounded-md">Confirm
                          </button>
                      </div>
                  </form>
            }
        </div>
  </div>
  )
}
