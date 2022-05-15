import { ChatIcon, CogIcon } from "@heroicons/react/outline";
import { UserCircleIcon } from "@heroicons/react/solid";
import axios from "axios";
import { useContext, useEffect, useState } from "react";
import {Link} from "react-router-dom"
import { useRecoilState } from "recoil";
import { filteredUsers, followers, logoutModal, mobilView, settingsModal } from "../atoms/modalAtom";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom"
import {PF} from "../pf"

export default function Sidebar({home, homePage}) {
    const [user, setUser] = useState([])
    const [closeBar, setCloseBar] = useState(false)
    const {dispatch, user:currentUser, socketUser} = useContext(AuthContext)
    const [openSetting, setOpenSetting] = useRecoilState(settingsModal)
    const [searchedUsers, setSearchedUsers] = useRecoilState(filteredUsers)
    const [logout, setLogout] = useRecoilState(logoutModal)
    const [loading, setLoading] = useState(true)
    const [errMssg, setErrMessg] = useState(false)
    const [homeMobile, setHomeMobile] = useRecoilState(mobilView)
    const navigate = useNavigate()

    useEffect(() => {
        const getUsers = async () => {
          try {
            setErrMessg(false)
            await axios.get(`${PF}/api/search/user?username=${searchedUsers}`)
            .then(res => {setUser(res.data); setLoading(false)})
          } catch (err) {
            console.log(err)
            setLoading(false)
            setErrMessg(true)
          }
            
        }
        getUsers()
    }, [searchedUsers])

    const getUserData = async e => {
        const res = await axios.get(`${PF}/api/user/${e.target.id}`)
        localStorage.setItem("currentUser", null)
        localStorage.setItem("currentUser", JSON.stringify(res.data))
        navigate("/friend/profile")
      }

    const [fetchFollowers, setFetchFollowers] = useState(false)
    const [following, setFollowing] = useRecoilState(followers)

    useEffect(() => {
        const getFans = async () => {
          try {
            await axios.get(`${PF}/api/user/fans/${currentUser._id}`)
            .then(fans => {
              setFollowing(fans.data.following)
            })
          } catch (err) {
            console.log(err)
          }
        }
        getFans()
       }, [fetchFollowers])
    
    
       const followUser = async e => {
         try {
          following.includes(e.target.id) ? (await axios.put(`${PF}/api/user/unfollow/${e.target.id}`, {userID:currentUser._id})) : (await axios.put(`${PF}/api/user/follow/${e.target.id}`, {userID:currentUser._id}))
          setFetchFollowers(!fetchFollowers)
         } catch (err) {
           console.log(err)
         }
       }

  return (
      <div className={`w-full ${homePage && "top-20 z-20 bg-white"} ${closeBar && 'hidden md:block'} fixed lg:w-48 xl:w-56 md:w-40`}>
          <div className="fullH overflow-y-scroll scrollbar scrollbar-thumb-gray-300 mt-12 ml-2 scrollbar-track-gray-200 scrollbar-thin p-2">
              <h2 className="font-semibold text-gray-600 my-4">Hi {currentUser.username}</h2>
              <div onClick={() => setHomeMobile(false)} className="flex flex-col items-start gap-4 mb-10">
                  <Link to="/messenger">
                      <div className="flex">
                          <ChatIcon className="h-5 mr-2 text-gray-600" />
                          <span className="text-sm">Chat</span>
                      </div>
                  </Link>
                  <div onClick={() => { setCloseBar(true); setOpenSetting(true)}} className="flex cursor-pointer">
                      <CogIcon className="h-5 mr-2 text-gray-600" />
                     <span className="text-sm">Settings</span>
                   </div>
                  <div className="flex">
                      <Link to='/profile' >
                          {currentUser.profilePicture ? <img className="h-6 w-6 mr-2 borderFull object-cover" src={currentUser.profilePicture} alt="" /> : <UserCircleIcon className="h-6 text-gray-600 mr-2" />}
                      </Link>
                      <Link to='/profile' >
                          <span className="text-sm">Profile</span>
                      </Link>
                  </div>

                  {(home || homePage) && <button onClick={() => {navigate('/'); setLogout(true)}} className="text-black border border-black font-semibold text-xs rounded-md my-4 p-2">
                    Log Out
                  </button>}
                  <div className='md:hidden bg-gray-400 w-full h-[1px]' />
                    <div className="md:hidden w-full  mb-20">
                        <p className="font-bold text-lg mb-5">All users</p>
                        {loading && <p className="text-gray-500 font-semibold text-lg text-center my-10">Fetching users...</p> }
                        {errMssg && <p className="text-red-400 opacity-60 font-bold text-lg text-center my-10">Check your internet connection</p> }
                        { 
                        user.filter(res => res._id !== currentUser._id)
                        .map(data => (
                            <div key={data._id} className="flex items-center justify-between w-[90%] space-x-2">
                              <div className="relative flex items-center justify-center gap-3">
                                  {data.profilePicture ?
                                    <img src={data.profilePicture} className="h-10 w-10 object-cover borderFull my-2" alt="" /> :
                                    <UserCircleIcon className="h-10 w-10 my-2 text-gray-400" />
                                  }
                                   {socketUser.some(s => s.userId == data._id) && <span className="bg-green-500 borderFull h-[10px] w-[10px] absolute top-2 left-7"></span>}
                                  <p id={data._id} onClick={getUserData} className="text-sm flex-1 font-semibold cursor-pointer">{data.username}</p>
                              </div>
                                  <button id={data._id} onClick={followUser} className={`p-2 md:p-1 lg:p-2 rounded-md text-xs ${following.includes(data._id) ? "bg-gray-600 text-white" : "bg-white text-black border border-black"}`}>
                                  {following.includes(data._id) ? "following" : "follow"}</button>
                              </div>
                          ))}
                  </div>
              </div>
          </div>
      </div>
  )
}