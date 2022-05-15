
import { UserCircleIcon } from "@heroicons/react/solid";
import axios from "axios";
import { useContext, useEffect, useRef, useState } from "react";
import { useRecoilState } from "recoil";
import { chatScreen, chatTopbar, getAMessage } from "../../atoms/modalAtom";
import { AuthContext } from "../../context/AuthContext";
import {PF} from "../../pf"

export default function Conversation({data, online, active}) {
  const {user} = useContext(AuthContext)
  const [thisConversation, setThisConversation] = useState([]);
  const [getMessage, setGetMessage] = useRecoilState(getAMessage)
  const [chatBar, setChatBar] = useRecoilState(chatTopbar)
  const [chatView, setChatView] = useRecoilState(chatScreen)
  
  // get conversations
  useEffect(() => {
    const getThisConversation = async () => {
      const res = online ? await axios.get(`${PF}/api/user/${online.userId}`) : await axios.get(`${PF}/api/user/${(user._id == data.recieverId) ? data.senderId : data.recieverId}`)
      setThisConversation(res.data)
    }
    getThisConversation()
  }, [data?.recieverId || online])


  return (
    <div onClick={() => {(data ? 
      ((data?.recieverId == user._id) ? setGetMessage([{conversationId: data._id, recieverId: data.senderId}]) : setGetMessage([{conversationId: data._id, recieverId: data.recieverId}])) : (setGetMessage([{conversationId: "", recieverId: online?.userId}])));
      setChatBar(thisConversation); setChatView(true)} } className="hover:bg-gray-200 bg-opacity-20 p-1 cursor-pointer">
        <div className="flex items-center justify-start gap-5">
          <div className="relative">
          {
            (thisConversation.profilePicture && thisConversation.profilePicture !== " ") ?
            <img src={thisConversation.profilePicture} className="h-14 w-14 borderFull object-cover" /> : 
            <UserCircleIcon className="h-14 text-gray-400" />
          }
          {(active?.includes(true) || online) && <span className="bg-green-500 p-[6px] borderFull absolute top-1 right-1 border border-white"></span>}
          </div> 
            <p className="text-gray-600 font-semibold">{thisConversation.username}</p>
        </div>
    </div>
  )
}
