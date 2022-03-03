
import { DotsVerticalIcon, EmojiHappyIcon, PaperAirplaneIcon, XIcon } from "@heroicons/react/outline";
import { UserCircleIcon } from "@heroicons/react/solid";
import axios from "axios";
import { useContext, useRef, useState } from "react";
import { useRecoilState } from "recoil";
import { commentData, commentSection, editCommentModal } from "../atoms/modalAtom";
import { AuthContext } from "../context/AuthContext";
import {PF} from "../pf"

export default function UpdateComment() {

    const {user} = useContext(AuthContext)
    const [commentMode, setCommentMode] = useRecoilState(commentSection)
    const [editCommentMode, setEditCommentMode] = useRecoilState(editCommentModal)
    const [comment, setComment] = useRecoilState(commentData)
    const [updating, setUpdating] = useState(false)
    const messageRef = useRef()

    const updatedComment = async () => {
        setUpdating(true)
        if(messageRef.current.value == comment.comment.text){
          setUpdating(false)
          setEditCommentMode(false)
          setCommentMode(true)
        } else {
            try {
              const setComment = {
                userid: user._id,
                postid: comment.postid,
                newComment: messageRef.current.value,
                oldComment: comment.comment.text,
                time: comment.comment.time
              }
              await axios.put('http://localhost:8800/api/post/comment/update', setComment)
              setUpdating(false)
              setEditCommentMode(false)
              setCommentMode(true)
            } catch (err) {
              setUpdating(false)
              console.log(err)
            }
        }
    }

  return (
    <div className='overflow-hidden'>
      <div onClick={() => {setEditCommentMode(false); setCommentMode(true)}} className="absolute bg-gray-300 opacity-70 w-screen z-10 top-0 h-screen" />
      <div className="bg-white opacity-100 h-[600px] absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 rounded-lg z-50 w-full max-w-[600px] p-5">
        <div className='flex items-center justify-end'><button onClick={() => {setEditCommentMode(false); setCommentMode(true)}} className='p-2 texr-xs text-white rounded-md font-semibold bg-red-500'>Back</button></div>
        <p className='text-gray-700 text-semibold text-center'>Edit Comment</p>
        <div className='bg-gray-300 h-[0.1px] w-full my-2' />
        <div className="h-[78%] !block overflow-y-scroll scrollbar scrollbar-thumb-gray-300 rollbar-track-gray-200 scrollbar-thin p-2">
          <div>
            {
                <div key={comment?.comment?.user.username + comment.text} className="flex gap-3 justify-start">
                  {comment?.comment?.user.profilePicture ? 
                  <img className="h-8 w-8 sm:h-10 sm:w-10 borderFull object-cover"
                  src={PF+comment?.comment?.user?.profilePicture} alt='' /> : 
                  <UserCircleIcon className='h-7 md:h-10 text-gray-500' />}
                  <div className='bg-gray-50 w-[88%] rounded-lg p-2 flex flex-col gap-10'>
                    <h3 className='font-bold text-gray-700 text-sm'>{comment?.comment?.user.username}</h3>
                    <div className="flex items-start justify-start border rounded-md">
                    <textarea ref={messageRef} defaultValue={comment?.comment?.text} type="text" placeholder="edit comment" className="text-sm text-gray-700 focus:outline-none w-[90%] border-none focus:ring-0 flex-1 cursor-auto scrollbar-thumb-gray-300 scrollbar-track-gray-200 scrollbar-thin !pb-3" />
                    </div>
                  </div>
                </div>
            }
          </div>
        </div>
        <button onClick={updatedComment} className="bg-gray-600 p-2 font-semibold w-full text-center text-white rounded-md">{updating ? 'Updating...' : 'Update'}</button>
      </div>
    </div>
  )
}
