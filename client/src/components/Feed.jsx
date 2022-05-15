
import { useEffect, useState } from "react";
import Share from "./Share";
import axios from "axios"
import Post from "./Post";
import { useContext } from "react"
import { AuthContext } from "../context/AuthContext";
import { useRecoilState } from "recoil";
import { filteredUsers, getPosts } from "../atoms/modalAtom";
import {PF} from "../pf"

export default function Feed({profile, UserProfile, home}) {

  const {user} = useContext(AuthContext)
  const [posts, setPosts] = useState([])
  const [getpost, setGetPosts] = useRecoilState(getPosts)
  const [searchedPosts, setSearchedPosts] = useRecoilState(filteredUsers)
  const [loading, setLoading] = useState(false)
  const currentUser = JSON.parse(localStorage.getItem("currentUser"));

  useEffect(() => {
    setSearchedPosts('')
  }, [])

  useEffect(() => {
    setLoading(true)
    const fetchHomePost = async () => {
      if(profile || UserProfile){
        try {
          const profileRes = await axios.get(`${PF}/api/post/timeline/${profile ? user._id : currentUser._id}?text=${searchedPosts}`)
          setPosts(profileRes.data)
          setLoading(false)
        } catch (err) {
          setLoading(false)
          console.log(err)
        }
      } else {
        try {
          const homeRes = await axios.get(`${PF}/api/post/search?text=${searchedPosts}`)
          setPosts(homeRes.data)
          setLoading(false)
        } catch (err) {
          setLoading(false)
          console.log(err)
        }
      }

    }
    fetchHomePost()
  }, [getpost, searchedPosts])
  
  return (
    <div>
      {!UserProfile && <Share />}
      {
        loading ? <h3 className='text-gray-300 text-lg font-semibold text-center my-20'>Fetching Posts...</h3> :
        posts.length == 0 ?
        <h3 className='text-gray-300 text-lg font-semibold text-center my-20'>Could not find any post</h3> :
         posts.filter((v, i, a) => a.findIndex(a => a._id == v._id) === i).map(post => <Post key={post._id} post={post}  />)
      }
    </div>
  )
}
