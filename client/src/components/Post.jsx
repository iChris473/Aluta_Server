
import { ChatAltIcon, DotsVerticalIcon} from "@heroicons/react/outline";
import { ThumbUpIcon, ThumbDownIcon, UserCircleIcon } from "@heroicons/react/solid";
import { useEffect, useState } from "react";
import axios from "axios";
import {format} from "timeago.js";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { commentLength, commentSection, getPostID, openModal, postID } from "../atoms/modalAtom";
import { useRecoilState } from "recoil";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom"

export default function Post({post, updateProfile}) {

  const {user:currentUser} = useContext(AuthContext)
  const [modalState, setModalState] = useRecoilState(openModal)
  const [getPostId, setGetPostId] = useRecoilState(postID)
  const [user, setUser] = useState([])
  const [commentMode, setCommentMode] = useRecoilState(commentSection)
  const [commentNumber, setCommentNumber] = useState(0)
  const [totalC, setTotalC] = useRecoilState(commentLength)
  
// get Posts
  useEffect(() => {
    const fetchPost = async () => {
      const res = await axios.get(`http://localhost:8800/api/user/${post.userID}`)
      setUser(res.data)
    }
    return fetchPost()
  }, [post.userID])
  
  // defining states
  const [like, setLike] = useState(post?.likes.length);
  const [liked, setLiked] = useState(false);
  const [disLiked, setDisliked] = useState(false);
  const [dislike, setDislike] = useState(post?.unlikes.length);
  const [getReactions, setGetReactions] = useState(false)

  // react to a post
  useEffect(() => {

    const getReactions = async () => {
      await axios.get(`http://localhost:8800/api/post/react/${post._id}`)
      .then(res => {
        if(res.data.like.includes(currentUser._id)){
          setLiked(true)
        } else {
          setLiked(false)
        }
        if(res.data.dislike.includes(currentUser._id)){
          setDisliked(true)
        } else {
          setDisliked(false)
        }
        setLike(res.data.like.length)
        setDislike(res.data.dislike.length)
      })
    }

    getReactions()
  }, [getReactions])

  // send like or dislike put request
  const handleLike = async () => {
    await axios.put(`http://localhost:8800/api/post/react?like=${post._id}`, {userID:currentUser._id})
    .then(() => setGetReactions(!getReactions))
  }
  const handleUnlike = async () => {
    await axios.put(`http://localhost:8800/api/post/react?dislike=${post._id}`, {userID:currentUser._id})
    .then(() => setGetReactions(!getReactions))
  }

  const navigate = useNavigate()

  const getUserData = async e => {
    if(user._id == currentUser._id ){
      navigate("/profile")
    } else {
      const res = await axios.get(`http://localhost:8800/api/user/${e.target.id}`)
      localStorage.setItem("currentUser", JSON.stringify(res.data))
      navigate("/friend/profile")
    }
}
  useEffect(() => {
    const getCommentNumbers = async () => {
      const res = await axios.get(`http://localhost:8800/api/post/comment/get/${post._id}`)
      setCommentNumber(res.data.length)
    }
    getCommentNumbers()
  }, [post._id, totalC])

  const PF = "http://localhost:8800/images/";
  return (
        <div key={post._id} className="boxShadow mx-2 mt-2 sm:mx-4 my-5">
          <div className="flex flex-col gap-5 p-2 !pb-6">
              <div className="flex justify-between items-center">
                <div className="flex items-center space-x-4">
                  <div className="cursor-pointer">
                    {
                      user.profilePicture && user.profilePicture !== " " ?
                        <img id={user._id} onClick={getUserData} className="h-8 w-8 sm:h-10 sm:w-10 borderFull object-cover"
                      src={PF+user.profilePicture} alt="" /> :
                        <UserCircleIcon id={user._id} onClick={getUserData} className="h-8 w-8 sm:h-10 sm:w-10 text-gray-400" />
                    }
                  </div>
                    <p id={user._id} onClick={getUserData} className="font-bold text-gray-800 cursor-pointer">{user.username}<span className="text-xs text-gray-600 ml-2 font-light">
                      {format(post.createdAt)}</span>
                    </p>
                </div>
               { (post.userID == currentUser._id) && <DotsVerticalIcon onClick={() => {setModalState(true); setGetPostId({postid:post._id, postImg:post.img})}} className="cursor-pointer h-4 sm:h-6 w-5 text-gray-700" />}
              </div>
              <div className="space-y-4">
                <div className={`${post.location && "flex justify-between items-center"} `}>
                  <p className="text-sm text-gray-900">{post?.desc}</p>
                  {post.location && <span className='text-xs text-gray-700 font-semibold'>@{post.location}</span>}
                </div>
                  {(post.img && post.img !== " " ) && <img src={post.img} className="rounded-sm object-cover lg:object-cover sm:h-[570px] md:h-[420px] lg:h-[570px] h-[420px] w-full" alt="" />}
                  
              </div>
              <div className="flex justify-between items-center">
                  <div  className="flex items-center justify-center space-x-1">
                    <ThumbUpIcon onClick={handleLike} className={`h-7 cursor-pointer text-gray-400 
                    ${liked && "!text-blue-600"}`} />
                    <p className="text-xs text-gray-800">{like}</p>
                    <ThumbDownIcon onClick={handleUnlike}  className={`h-7 mt-2 cursor-pointer text-gray-400 
                    ${disLiked && "!text-gray-800"}`} />
                    <p className="text-xs text-gray-800">{dislike}</p>
                  </div>
                  <div className="flex items-center justify-center gap-2">
                    <p className='text-sm text-gray-400 font-semibold'>{commentNumber}</p>
                     <ChatAltIcon onClick={() => {setGetPostId(post._id); setCommentMode(true)}} className='h-6 cursor-pointer !text-gray-400' /> </div>
              </div>
          </div>
      </div>
  )
}
