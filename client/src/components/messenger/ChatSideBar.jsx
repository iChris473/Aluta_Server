
import { useContext, useEffect, useState } from "react";
import Conversation from "./Conversation";
import axios from "axios"
import { AuthContext } from "../../context/AuthContext";
import { activeUsers } from "../../atoms/modalAtom";
import { useRecoilState } from "recoil";
import {PF} from "../../pf"


export default function ChatSideBar() {

  const {user, socketUser} = useContext(AuthContext)
  const [allConversations, setAllConversations] = useState([])
  const [recentConversation, setRecentConversation] = useState([])

  useEffect(() => {
    const getConversation = async () => {
      const res = await axios.get(`${PF}/api/chat/get/${user._id}`)
      setAllConversations(res.data)
    }
    getConversation()
  }, [])

useEffect(() => {
  let onlineConversation = [];
  setRecentConversation([])
  socketUser.forEach(user => {
    if(!allConversations.some(c => user.userId == (c.recieverId || c.senderId ))){
      if(onlineConversation.some(c => c.userId !== user.userId)){
        onlineConversation.push(user)
      } 
    }
    return onlineConversation
  })
  setRecentConversation([onlineConversation])
}, [socketUser, allConversations])

  return (
    <div className="w-full top-20 z-20 bg-white fixed md:sticky md:bg-transparent">
        <div className="fullH md:mt-20 mb-5 overflow-y-scroll scrollbar scrollbar-thumb-gray-300 scrollbar-track-gray-200 scrollbar-thin p-2 pt-10">
          <h1 className='m-2 text-lg font-semibold text-gray-600'>Chats</h1>
          <div className='bg-gray-300 h-[0.1px] w-full mb-5 ' />
              <div className="flex flex-col mx-3 gap-5">
                {(allConversations?.length == 0 && recentConversation[0]?.length == 0) && <p className='font-semibold text-md text-gray-400'>You dont have any conversation yet</p>}
                {
                  allConversations?.map(data => (
                    <Conversation key={data._id} active={socketUser.map(u => u.userId == data.recieverId || data.senderId)} data={data} />
                  ))
                }
                {
                  (recentConversation && recentConversation.length !== 1) && recentConversation?.map(user => (
                    <Conversation key={user._socketId} online={user} />
                  ))
                }
              </div>
        </div>
    </div>
  )
}
