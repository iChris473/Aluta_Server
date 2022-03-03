
import userImg from "../assets/Technical-Innovation.png"
import { useContext, useEffect, useState } from "react"
import { AuthContext } from "../context/AuthContext"
import axios from "axios"
import { UserCircleIcon } from "@heroicons/react/solid"
import { followers } from "../atoms/modalAtom"
import { useRecoilState } from "recoil"
import { useNavigate } from "react-router"
import {PF} from "../pf"

export default function HomeRightBar() {

    const [user, setUser] = useState([])
    const {user:currentUser, socketUser} = useContext(AuthContext)
    const [fetchFollowers, setFetchFollowers] = useState(false)
    const [following, setFollowing] = useRecoilState(followers)
    const [filterInput, setFilterInput] = useState('')
    useEffect(() => {
        const getUsers = async () => {
            const res = await axios.get(`http://localhost:8800/api/search/user?username=${filterInput}`)
            setUser(res.data)
        }
        getUsers()
    }, [filterInput])

    const navigate = useNavigate()

    const getUserData = async e => {
        const res = await axios.get(`http://localhost:8800/api/user/${e.target.id}`)
        localStorage.setItem("currentUser", null)
        localStorage.setItem("currentUser", JSON.stringify(res.data))
        navigate("/friend/profile")
    }
    const followUser = async e => {
        try {
         following.includes(e.target.id) ? (await axios.put(`http://localhost:8800/api/user/unfollow/${e.target.id}`, {userID:currentUser._id})) : (await axios.put(`http://localhost:8800/api/user/follow/${e.target.id}`, {userID:currentUser._id}))
         setFetchFollowers(!fetchFollowers)
        } catch (err) {
          console.log(err)
        }
      }
      useEffect(() => {
        const getFans = async () => {
          try {
            await axios.get(`http://localhost:8800/api/user/fans/${currentUser._id}`)
            .then(fans => {
              setFollowing(fans.data.following)
            })
          } catch (err) {
            console.log(err)
          }
        }
        getFans()
       }, [fetchFollowers])
      
  return (
    <div className="my-5 mx-1">
    <div className="flex flex-col space-y-5">
      <img src={userImg} className="h-60 w-full object-cover rounded-lg" alt="" />
      <div className='bg-gray-200 p-2'>
        {<input type="text" onChange={e => setFilterInput(e.target.value)} placeholder="Search" className="text-xs rounded-r-full hidden md:inline mx-auto rounded-l-full focus:outline-none border-none focus:ring-0" />}
      </div>
      <div>
        <p className="font-bold text-lg mb-5">All Users</p>
        {
          user.filter(res => res._id !== currentUser._id).map(data => (
            <div key={data._id} className="flex items-center justify-between lg:m-3">
              <div className="relative flex items-center justify-center gap-3">
                {
                  data.profilePicture ?
                    <img src={PF + data.profilePicture} className="h-8 w-8 sm:h-10 sm:w-10 borderFull object-cover" alt="" /> :
                    <UserCircleIcon className="h-8 w-8 text-gray-400 sm:h-10 sm:w-10" />
                }
                {socketUser.some(s => s.userId == data._id) && <span className="bg-green-500 borderFull h-[10px] w-[10px] absolute top-1 left-7"></span>}
                <span id={data._id} onClick={getUserData} className="font-semibold cursor-pointer">
                  {data.username}
                </span>
              </div>
              <button id={data._id} onClick={followUser} className={`p-2 md:p-1 lg:p-2 rounded-md text-xs ${following.includes(data._id) ? "bg-gray-600 text-white" : "bg-white text-black border border-black"}`}>{following.includes(data._id) ? "following" : "follow"}</button>
            </div>
          ))
        }
      </div>
    </div>
  </div>
  )
}
