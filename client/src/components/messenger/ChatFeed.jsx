import { EmojiHappyIcon, PaperAirplaneIcon, PhotographIcon } from "@heroicons/react/outline";
import axios from "axios";
import { useContext, useEffect, useRef, useState } from "react";
import { useRecoilState } from "recoil";
import { activeUsers, chatTopbar, getAMessage } from "../../atoms/modalAtom";
import { AuthContext } from "../../context/AuthContext";
import Message from "./Message";


export default function ChatFeed() {

  const {user, socket} = useContext(AuthContext)
  const [currentMessage, setCurrentMessage] = useState([])
  const [emptyMessage, setEmptyMessage] = useState(false)
  const [arrivalMessage, setArrivalMessage] = useState(null)
  const [conversation, setConversation] = useRecoilState(getAMessage)
  const [thisConversation, setThisConversation] = useState(conversation[0]?.conversationId)
  const [checkConversation, setCheckConversation] = useState(true)
  const messageRef = useRef()
  const [chatBar, setChatBar] = useRecoilState(chatTopbar)

  useEffect(() => {
    const fetchMessage = async () => {
      if(conversation == "" || (conversation[0].conversationId == "" && conversation[0].recieverId == "")){
        setCurrentMessage([])
      } else {
        if(!conversation[0].conversationId || conversation[0].conversationId === ""){
          const conversationID  = await axios.get(`http://localhost:8800/api/chat/conversation?senderId=${user._id}&recieverId=${conversation[0]?.recieverId}`)

          !conversationID?.data[0]?._id ? setThisConversation("") : setThisConversation(conversationID?.data[0]?._id)

          // get Messages
          const thisMessage = await axios.get(`http://localhost:8800/api/chat/message/get/${conversationID?.data[0]?._id}`)

          setCurrentMessage(thisMessage.data)
        }
          // get Messages
          const thisMessage = await axios.get(`http://localhost:8800/api/chat/message/get/${conversation[0].conversationId}`)
          setCurrentMessage(thisMessage.data) 
      }
    }
    fetchMessage()
  },[conversation, thisConversation])
  const sendMessage = async () => {

    let thisCurrentConversation = thisConversation;
    // check if theres already a conversation
    const conversationID = await axios.get(`http://localhost:8800/api/chat/conversation?senderId=${user._id}&recieverId=${conversation[0]?.recieverId}`)

    !conversationID?.data[0]?._id ? (thisCurrentConversation = "") : (thisCurrentConversation = conversationID?.data[0]?._id)
    let thisConversationID;
    // create new conversation if theres no conversation
    if(thisCurrentConversation === "" || !thisCurrentConversation){
      try {
        const newConversation = {
          senderId: user._id,
          recieverId: conversation[0].recieverId
        }
        const res = await axios.post("http://localhost:8800/api/chat/conversation", newConversation)
        setThisConversation(res.data._id)
        thisConversationID = res.data._id
      } catch (err) {
      //  console.log(err) 
      }
    }

    try {
      // console.log("creating messages")
      const newMessage = {
        senderId: user._id,
        text: messageRef.current.value.trim(),
      }
      newMessage.conversationId = (thisCurrentConversation && thisCurrentConversation !== "") ? thisCurrentConversation : thisConversationID;

      const res = await axios.post("http://localhost:8800/api/chat/message/send", newMessage)
      newMessage._id = res.data._id
      // send message to socket server
      socket.current?.emit("sendMessage", {
        senderId: user._id,
        recieverId: conversation[0].recieverId,
        text: messageRef.current.value.trim(),
        _id: res.data._id
      })
      setCurrentMessage(currentMessage.concat(newMessage))

      // clear input field
      messageRef.current.value = "";

    } catch (err) {
      console.log(err)
    }
  }

  // get message from socket server
  useEffect(() => {
    socket.current?.on("getMessage", data =>  setArrivalMessage({
        text: data.text,
        senderId: data.senderId,
        createdAt: Date.now(),
        _id: data._id
      })
    )
  }, [conversation])

  // gets message from  sender using web sockets
  useEffect(() => {   
     (chatBar._id == conversation[0]?.recieverId || user._id) && arrivalMessage && currentMessage?.filter(m => m._id == arrivalMessage?._id) == "" &&
        setCurrentMessage(currentMessage?.concat(arrivalMessage));

  }, [arrivalMessage, conversation])

  return (
    <div className="screenH relative pt-1">
        <div className="h-[82%] overflow-y-scroll scrollbar scrollbar-thumb-gray-300 rollbar-track-gray-200 scrollbar-thin mt-20 p-2 pb-5">
            {
              (currentMessage !== "" && currentMessage.length !== 0) ? currentMessage?.map(messages => (
                  <Message last={currentMessage[currentMessage.length - 1]} own={messages.senderId == user._id} key={messages._id} messages={messages} />
                )) : <Message empty />
            }
        </div>
        <div className={`${chatBar.length == 0 && "hidden"} absolute -bottom-24 bg-white p-5 w-full`}>
        <div className="border p-1 border-gray-400 rounded-full w-full">
          <div className="flex items-start justify-start">
            <EmojiHappyIcon className="text-gray-700 ml-5 h-7 mt-2" />
            <textarea ref={messageRef} onChange={e => !e.target.value.trim() ? setEmptyMessage(true) : setEmptyMessage(false)} type="text" placeholder="message" className="text-sm focus:outline-none w-[90%] bg-transparent border-none focus:ring-0 flex-1 cursor-auto scrollbar-thumb-gray-300 scrollbar-track-gray-200 scrollbar-thin" />
            {!emptyMessage && <PaperAirplaneIcon onClick={sendMessage} className="text-red-500 h-5 mr-4 mt-2 rotate-45 cursor-pointer" />}
          </div>
        </div>
        </div>
    </div>
  )
}