
import { DotsVerticalIcon, EmojiHappyIcon, PaperAirplaneIcon, XIcon } from "@heroicons/react/outline";
import { UserCircleIcon } from "@heroicons/react/solid";
import { useRef, useState, useEffect, useContext } from "react";
import { useRecoilState } from "recoil";
import { commentData, commentLength, commentSection, editCommentModal, postID } from "../atoms/modalAtom";
import axios from 'axios'
import { AuthContext } from "../context/AuthContext";
import { format } from "timeago.js";
import {PF} from "../pf"

export default function CommentModal() {

  const {user} = useContext(AuthContext)
  const [commentMode, setCommentMode] = useRecoilState(commentSection)
  const [editCommentMode, setEditCommentMode] = useRecoilState(editCommentModal)
  const [userComment, setUserComment] = useRecoilState(commentData)
  const [emptyMessage, setEmptyMessage] = useState(true)
  const [postid ,setPostId] = useRecoilState(postID)
  const [allComments, setAllComments] = useState([])
  const [commentUser, setCommentUser] = useState([])
  const [commentNumber, setCommentNumber] = useRecoilState(commentLength)
  const [commentText, setCommentText] = useState('')
  const [loading, setLoading] = useState(true)
  const [closeEdit, setCloseEdit] = useState(true)
  const messageRef = useRef()

    // Get Comments
    useEffect(() => {
      const getAllComment = async () => {
        try {
          const res = await axios.get(`http://localhost:8800/api/post/comment/get/${postid}`)
          setCommentUser(res.data)
        } catch (err) {
          console.log(err)
        }
      }
      getAllComment()
    }, [postid])
  

  useEffect(() => {
    let totalComments = []
    setLoading(true)
    const getUserProfile = async () => {

      await Promise.all(
        commentUser.map( async comment => {
          try {
            const res = await axios.get(`http://localhost:8800/api/user/${comment.userId}`)
            return totalComments.push({user: res.data, text: comment.text, time: comment.time, id: comment._id, date: comment.createdAt})
          } catch (err) {
            console.log(err)
          }
        }))
        setAllComments(totalComments)
        setLoading(false)
      }
      getUserProfile()
  }, [commentUser])
  

  const sendMessage = async () => {
    const newComment = {
        userId: user._id,
        text: messageRef.current.value,
        postId: postid,
        time: Date.now()
      }
      try {
        const res = await axios.post(`http://localhost:8800/api/post/comment/create`, newComment)
        setAllComments(allComments.concat({user, text: messageRef.current.value}))
        messageRef.current.value = ''
        setCommentNumber(!commentNumber)
      } catch (err) {
        console.log(err)
      }
    }
    
    const deleteComment = async e => {
      console.log(e.target.id, e.target.name)
    try {
      await axios.delete(`http://localhost:8800/api/post/comment/delete/${postid}?userid=${user._id}&text=${e.target.id}&time=${e.target.name}`)
      setCloseEdit(true)
      const newComment = allComments.filter(c => c.user._id != user.id && c.text != e.target.id)
      setAllComments(newComment)
      setCommentNumber(!commentNumber)
    } catch (err) {
      console.log(err)
    }
  }

  return (
    <div className='overflow-hidden'>
      <div onClick={() => setCommentMode(false)} className="absolute bg-gray-300 opacity-70 w-screen z-10 top-0 h-screen" />
      <div className="bg-white opacity-100 h-[600px] absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 rounded-lg z-50 w-full max-w-[600px] p-5">
        <div className='flex items-center justify-end'><XIcon onClick={() => setCommentMode(false)} className='h-7 text-red-500 cursor-pointer' /></div>
        <p className='text-gray-700 text-semibold text-center'>All Comments</p>
        <div className='bg-gray-300 h-[0.1px] w-full my-2' />
        <div className="h-[78%] !block overflow-y-scroll scrollbar scrollbar-thumb-gray-300 rollbar-track-gray-200 scrollbar-thin p-2">
          <div className='flex flex-col gap-3'>
            { allComments.length == 0 ? 
              <p className="font-semibold text-gray-300 text-center mt-20 text-md ">{loading ? 'Getting Comments...' : 'This post doesnt have any comment'}</p> :
              allComments?.map(comment => (
                <div key={comment.id} className="flex gap-3 justify-start">
                  {comment.user.profilePicture ? 
                  <img className="h-8 w-8 sm:h-10 sm:w-10 borderFull object-cover"
                  src={PF+comment.user.profilePicture} alt='' /> : 
                  <UserCircleIcon className='h-7 md:h-10 text-gray-500' />}
                  <div className='bg-gray-100 w-[88%] rounded-lg p-2 flex flex-col relative'>
                    {
                      (user._id == comment.user._id) && <DotsVerticalIcon onClick={() => { setCommentText((comment.text + comment.username)); setCloseEdit(!closeEdit) }} className='w-3 absolute top-3 right-2 cursor-pointer' />
                    }
                    {
                      (commentText == (comment.text + comment.username)) && !closeEdit &&
                      <div className='absolute top-6 right-5 p-2 bg-gray-500 z-10 rounded-md flex flex-col items-start gap-3'>
                        <button onClick={deleteComment} name={comment.time} id={comment.text} className='text-xs text-white bg-gray-600 p-2 rounded-md'>Delete comment</button>
                        <button onClick={() =>{setUserComment({comment, postid});setCommentMode(false);setEditCommentMode(true)}} className='text-xs text-white bg-gray-600 p-2 rounded-md w-full'>Edit comment</button>
                        <button onClick={() => setCloseEdit(true)} className='text-xs text-white bg-gray-400 p-2 rounded-md w-full'>Cancel</button>
                      </div>
                    }
                    <h3 className='font-bold text-gray-700 text-sm'>{comment.user.username}</h3>
                    <p className='text-sm text-gray-800'>{comment.text}</p>
                    <p className='text-xs text-gray-400 text-right mt-1'> {format(comment.date)}</p>
                  </div>
                </div>
              ))
            }
          </div>
        </div>

        <div className="flex items-start justify-start border rounded-md">
          <EmojiHappyIcon className="text-gray-700 mt-2 ml-5 h-7" />
          <textarea ref={messageRef} onChange={e => !e.target.value.trim() ? setEmptyMessage(true) : setEmptyMessage(false)} type="text" placeholder="write a comment" className="text-sm focus:outline-none w-[90%] bg-transparent border-none focus:ring-0 flex-1 cursor-auto scrollbar-thumb-gray-300 scrollbar-track-gray-200 scrollbar-thin"  />
          {!emptyMessage && <PaperAirplaneIcon onClick={sendMessage} className="text-red-500 mt-2 h-5 mr-2 rotate-45 cursor-pointer" />}
        </div>
      </div>
    </div>
  )
}
