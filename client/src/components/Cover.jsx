
import { PaperAirplaneIcon, PhotographIcon } from "@heroicons/react/outline";
import { UserCircleIcon } from "@heroicons/react/solid";
import axios from "axios";
import { useContext, useRef, useState } from "react"
import { Link } from "react-router-dom";
import { useRecoilState } from "recoil";
import { chatTopbar, followers, getAMessage, setFollows } from "../atoms/modalAtom";
import { AuthContext } from "../context/AuthContext";

export default function Cover({UserProfile}) {

  const {user, socketUser} = useContext(AuthContext)
  const [following, setFollowing] = useRecoilState(followers)
  const [allFollows, setAllFollows] = useRecoilState(setFollows)
  const [follow, setFollow] = useState(following)
  const [chatBar, setChatBar] = useRecoilState(chatTopbar)
  const [getMessage, setGetMessage] = useRecoilState(getAMessage)

  const PF = "http://localhost:8800/images/";

  const currentUserProfile = JSON.parse(localStorage.getItem("currentUser"));
  const followUser = async e => {
    if(follow.includes(e.target.id)){
      try {
        const res = await axios.put(`http://localhost:8800/api/user/unfollow/${e.target.id}`, {userID:user._id})
        following.filter(f => f !== e.target.id)
        setFollow(following.filter(f => f !== e.target.id))
        setAllFollows(!allFollows)
      } catch (err) {
        console.log(err)
      }
    } else{
      try {
      const res = await axios.put(`http://localhost:8800/api/user/follow/${e.target.id}`, {userID:user._id});
      following.concat(e.target.id)
      setFollow(following.concat(e.target.id))
      }
     catch (err) {
      console.log(err)
    }
  }
}

  const UserCover = () => (
    <div className="flex flex-col gap-3">
    <div className="md:pl-3 lg:px-1 relative mb-7">
        {user.coverPhoto && user.coverPhoto !== " " ? <img src={PF+user.coverPhoto} className="h-60 md:h-80 w-full object-cover rounded-sm" alt="" /> : (
          <div className="rounded-sm  w-full h-60 bg-gray-200 relative">
            <PhotographIcon className="h-16 text-gray-400 absolute transform top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 cursor-pointer" />
          </div>
        )}
        {user.profilePicture && user.profilePicture !== " " ? <img src={PF+user.profilePicture} className="h-36 w-36 p-1 object-cover borderFull border bg-white border-white absolute -bottom-28 transform left-1/2 -translate-x-1/2 -translate-y-1/2" alt="" /> : <UserCircleIcon className="h-36 w-36 object-cover borderFull bg-white absolute -bottom-28 transform left-1/2 -translate-x-1/2 -translate-y-1/2 text-gray-300" />}
    </div>
    <div className="flex flex-col items-center justify-center my-5">
        <p className="font-bold text-lg">{user.username}</p>
       {socketUser.some(o => o.userId == user._id) && <p className="text-xs text-green-500 font-bold my-1">Active now</p>}
        <p className="text-sm text-gray-800 my-1">{user.bio}</p>
        <Link to={`/profile/update/${user.username}`}>
          <button className="text-xs p-2 font-semibold bg-blue-500 text-white rounded-md my-3">Edit profile</button>
        </Link>
    </div>
  </div>
  )

  const CurrentUserCover = () => {

  return (
    <div className="flex flex-col gap-3">
      <div className="md:pl-3 lg:px-1 relative mb-7">
          {currentUserProfile?.coverPhoto && currentUserProfile?.coverPhoto !== " " ? <img src={PF+currentUserProfile.coverPhoto} className="h-60 md:h-80 w-full object-cover rounded-sm" alt="" /> : (
            <div className="rounded-sm  w-full h-60 bg-gray-200 relative">
              <PhotographIcon className="h-16 text-gray-400 absolute transform top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 cursor-pointer" />
            </div>
          )}
          {currentUserProfile.profilePicture && currentUserProfile?.profilePicture !== " " ? <img src={PF+currentUserProfile.profilePicture} className="h-36 w-36 p-1 object-cover borderFull border bg-white border-white absolute -bottom-28 transform left-1/2 -translate-x-1/2 -translate-y-1/2" alt="" /> : <UserCircleIcon className="h-36 w-36 object-cover borderFull bg-white absolute -bottom-28 transform left-1/2 -translate-x-1/2 -translate-y-1/2 text-gray-300" />}
      </div>
      <div className="flex flex-col items-center justify-center my-5">
          <p className="font-bold text-lg">{currentUserProfile?.username}</p>
          {socketUser.some(o => o.userId == currentUserProfile._id) && <p className="text-xs text-green-500 font-bold my-1">Active now</p>}
          <p className="text-sm text-gray-800 my-1">{currentUserProfile?.bio}</p>
          <div className="flex items-center gap-4">
            <Link to={`/messenger`}>
              <div onClick={() => {setChatBar(currentUserProfile);  setGetMessage([{conversationId: '', recieverId: currentUserProfile._id}])}} className="flex items-center gap-2 bg-blue-500 rounded-md my-3 p-2">
                <p className="text-xs font-semibold text-white">
                  Send Message
                </p>
                  <PaperAirplaneIcon className="rotate-45 text-white h-4" />
              </div>
            </Link>
            <button id={currentUserProfile._id} onClick={followUser} className={`text-xs p-2 font-semibold  text-white rounded-md my-3 ${follow.includes(currentUserProfile._id) ? "bg-red-500" : "bg-gray-500"}`}>{follow.includes(currentUserProfile._id) ? "Following" : "Follow"}</button>
          </div>
      </div>
  </div>
  ) }

  return (
     UserProfile ?  <CurrentUserCover /> : <UserCover /> 

  )
}
