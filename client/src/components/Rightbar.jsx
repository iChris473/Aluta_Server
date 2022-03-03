
import axios from "axios";
import { useContext, useEffect, useState } from "react";
import { UserCircleIcon } from "@heroicons/react/solid";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom"
import { followers, setFollows } from "../atoms/modalAtom";
import { useRecoilState } from "recoil";
import HomeRightBar from "./HomeRightBar";
import {PF} from "../pf"

export default function Rightbar({profile, userProfile}) {
  const [user, setUser] = useState([])
  const {user:currentUser, socketUser} = useContext(AuthContext)
  const currentUserProfile = JSON.parse(localStorage.getItem("currentUser"));
  const [fans, setFans] = useRecoilState(setFollows)

// Get followers and following
const [allFollowers, setAllFollowers] = useState([])
const [allFollowing, setAllFollowing] = useState([])

useEffect(() => {
  let allCurrentFollowers = []
  let allCurrentFollowing = []
  const getUsers = async () => {
     const res = await axios.get(`http://localhost:8800/api/user/fans/${profile ? currentUser._id : currentUserProfile._id}`)
    // get followers data
    res.data.followers.forEach(async f => {
      const allFan = await axios.get(`http://localhost:8800/api/user/${f}`)
      const all = allCurrentFollowers.filter(f => f._id != allFan.data._id).concat(allFan.data)
      setAllFollowers(all)
    })
    // get following data
    res.data.following.map(async f => {
      const allFan = await axios.get(`http://localhost:8800/api/user/${f}`)
      const all = allCurrentFollowing.filter(f => f._id != allFan.data._id).concat(allFan.data)
      setAllFollowing(all)
    })
  }
  (profile || userProfile) &&  getUsers()
  //  console.log(fans)
  
},[fans])

 
const [fetchFollowers, setFetchFollowers] = useState(false)
const [following, setFollowing] = useRecoilState(followers)
const navigate = useNavigate()

  const getUserData = async e => {
    if(e.target.id == currentUser._id){
      navigate("/profile")
    } else{
      const res = await axios.get(`http://localhost:8800/api/user/${e.target.id}`)
      localStorage.setItem("currentUser", null)
      localStorage.setItem("currentUser", JSON.stringify(res.data))
      navigate("/friend/profile")
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

 const followUser = async e => {
   try {
    following.includes(e.target.id) ? (await axios.put(`http://localhost:8800/api/user/unfollow/${e.target.id}`, {userID:currentUser._id})) : (await axios.put(`http://localhost:8800/api/user/follow/${e.target.id}`, {userID:currentUser._id}))
    setFetchFollowers(!fetchFollowers)
   } catch (err) {
     console.log(err)
   }
 }

    
// RIght bar dispalyed at the profile page

 const ProfileRightBar = () => {

    return (
      <div className="p-5 flex flex-col gap-3 w-full">
        <div className="space-y-3 mt-2">
          <p className="font-bold text-lg text-gray-700 ">User information</p>
          <div className="space-x-2">
            <span className="text-gray-400">City:</span>
            <span className="font-semibold text-green-700">{currentUser?.city || "Add your city"} </span>
          </div>
          <div className="space-x-2">
            <span className="text-gray-400">From:</span>
            <span className="font-semibold text-green-700">{currentUser?.from || "Add your city"}</span>
          </div>
          <div className="space-x-2">
            <span className="text-gray-400">Relationship:</span>
            <span className="font-semibold text-xs lg:text-sm text-green-700">{currentUser?.relationship || "Add your Relationship status"}</span>
          </div>
        </div>
        {allFollowers.length != 0 &&
        <div className=" mt-2 ">
         <p  className="font-bold text-lg text-gray-700 text-center">Followers</p>             
          <div  className="space-y-3 mt-2 flex flex-wrap md:flex-col">
              {allFollowers.map(data => (
              <div key={data._id} className="flex items-center justify-center md:justify-start w-1/2 gap-3">
                {data.profilePicture ? <img onClick={getUserData} id={data._id}  src={PF + data.profilePicture} className="borderFull h-10 w-10 cursor-pointer" alt="" /> : <UserCircleIcon onClick={getUserData} id={data._id} className="h-10 w-10 cursor-pointer text-gray-400" />}
                <span onClick={getUserData} id={data._id} className="italic text-sm cursor-pointer">{data.username}</span>
              </div>
              ))}
          </div>
        </div> 
          }
          {(allFollowers.length == 0) && <p className="font-bold text-sm my-5 text-gray-400 text-center">You dont have any active followers</p>}
          { allFollowing.length != 0 &&
          <div className=" mt-2 ">
            <p  className="font-bold text-lg text-gray-700 text-center">Following</p>
          <div  className="space-y-3 mt-2 flex flex-wrap md:flex-col">
              {allFollowing.map(data => (
              <div key={data._id} className="flex items-center justify-center md:justify-start w-1/2 gap-3">
                {data.profilePicture ? <img onClick={getUserData} id={data._id} src={PF + data.profilePicture} className="borderFull h-10 w-10 cursor-pointer" alt="" /> : <UserCircleIcon onClick={getUserData} id={data._id} className="h-10 w-10 cursor-pointer text-gray-400" />}
                <span onClick={getUserData} id={data._id} className="italic text-sm cursor-pointer">{data.username}</span>
              </div>
              ))} 
            {allFollowing.length == 0 && <p className="font-bold text-md my-5 text-gray-600 text-center">Start Following friends on Aluta</p>}
          </div> 
        </div>
          }
      </div>
    )
  }

// Right Bar displayed in a users profile
const UsersRightBar = () => {
  const currentUserProfile = JSON.parse(localStorage.getItem("currentUser"));
  return (
    <div className="p-5 flex flex-col gap-3 w-full">
      <div className="space-y-3 mt-2">
        {(currentUserProfile.city || currentUserProfile.from || currentUserProfile.relationship) && <p className="font-bold text-lg text-gray-700 ">User information</p>}
        {currentUserProfile.city && 
        (<div className="space-x-2">
          <span className="text-gray-400">City:</span>
          <span className="font-semibold text-green-700">{currentUserProfile.city}</span>
        </div>)}
        {currentUserProfile.from &&
        (<div className="space-x-2">
          <span className="text-gray-400">From:</span>
          <span className="font-semibold text-green-700">{currentUserProfile.from}</span>
        </div>)}
        {currentUserProfile.relationship &&
        (<div className="space-x-2">
          <span className="text-gray-400">Relationship:</span>
          <span className="font-semibold text-green-700">{currentUserProfile.relationship}</span>
        </div>)}
      </div>
      { allFollowers.length != 0 &&
        (<div className=" mt-2 ">
            <p  className="font-bold text-lg text-gray-700 text-center">Followers</p>
          <div  className="space-y-3 mt-2 flex flex-wrap md:flex-col">
            {
              allFollowers?.map(data => (
              <div key={data._id} className="flex items-center justify-center md:justify-start w-1/2 gap-3">
                {data.profilePicture ? <img onClick={getUserData} id={data._id} src={PF + data.profilePicture} className="borderFull h-10 w-10 cursor-pointer" alt="" /> : <UserCircleIcon onClick={getUserData} id={data._id} className="h-10 w-10 cursor-pointer text-gray-400" />}
                <span onClick={getUserData} id={data._id} className="italic text-sm cursor-pointer">{data.username}</span>
              </div>
              ))
            }
          </div>
        </div>)}
        {allFollowing.length != 0  &&
         <div className=" mt-2 ">
            <p  className="font-bold text-lg text-gray-700 text-center">Following</p>
          <div  className="space-y-3 mt-2 flex flex-wrap md:flex-col">
            {
              allFollowing.map(data => (
              <div key={data._id} className="flex items-center justify-center md:justify-start w-1/2 gap-3">
                {data.profilePicture ? <img onClick={getUserData} id={data._id} src={PF + data.profilePicture} className="borderFull h-10 w-10 cursor-pointer" alt="" /> : <UserCircleIcon onClick={getUserData} id={data._id} className="h-10 w-10 cursor-pointer text-gray-400" />}
                <span onClick={getUserData} id={data._id} className="italic text-sm cursor-pointer">{data.username}</span>
              </div>
              ))
            }
          </div>
        </div>}
        
    </div>
  )
}

  return (
    <div>
      { profile ? <ProfileRightBar/> : (userProfile ? <UsersRightBar /> : <HomeRightBar />) }
    </div>
  )
}
