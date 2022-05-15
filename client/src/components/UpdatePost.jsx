
import { PhotographIcon, PencilAltIcon } from "@heroicons/react/outline"
import axios from "axios"
import { useEffect, useRef, useState } from "react"
import { useRecoilState } from "recoil"
import { getPosts, postID } from "../atoms/modalAtom"
import { Link, useNavigate } from "react-router-dom"
import { ref, getDownloadURL, uploadBytes, deleteObject } from "firebase/storage";
import storage from "../firebase"
import {PF} from "../pf"

export default function UpdatePost() {

  const [postid, setPostid] = useRecoilState(postID)
  const navigate = useNavigate()
  const chooseImg = useRef()
  const [post, setPost] = useState([])

  const [getpost, setGetPosts] = useRecoilState(getPosts)

  useEffect(() => {
    const getSinglePost = async () => {
      await axios.get(`${PF}/api/post/get/${postid.postid}`)
        .then(res => setPost(res.data))
    }
    getSinglePost()
  }, [postid])

  useEffect(() => {
    !postid && navigate("/")
  }, [])

  // define states
  const [updateLocation, setUpdateLocation] = useState(post.location)
  const [updateDesc, setUpdateDesc] = useState(post.desc)
  const [file, setFile] = useState(null)
  const [postImg, setPostImg] = useState(post.img)
  const [removeImg, setRemoveImg] = useState(false)
  const [updating, setUpdating] = useState(false)

  const handleRemvImg = async () => {
    setFile(null);
    // delete previous file
    const deleteRef = ref(storage, `${post.img}`)

    // Delete the file
    deleteObject(deleteRef).then(() => {
      // File deleted successfully
      console.log('old picture deleted')
    }).catch((error) => {
      // Uh-oh, an error occurred!
      console.log(error)
    });
    setPostImg(" ");
    setRemoveImg(true)
  }

  const updatePost = async () => {
    setUpdating(true)
    const newPost = {
      desc: updateDesc,
      location: updateLocation,
    };

      if (file) {
        if(postImg && postImg != " "){
         // delete previous file
          const deleteRef = ref(storage, `${post.img}`)
  
          // Delete the file
          deleteObject(deleteRef).then(() => {
            // File deleted successfully
            console.log('old picture deleted')
          }).catch((error) => {
            // Uh-oh, an error occurred!
            console.log(error)
          });
        }
        const firebaseImageRef = ref(storage, `${file.name}`)

        const metadata = {
          contentType: 'image/jpeg',
        };
        
        try {
          await uploadBytes(firebaseImageRef, file, metadata)
            .then(async snapshot => {
              const downloadURL = await getDownloadURL(firebaseImageRef)
              newPost.img = downloadURL;
            })
        } catch (err) {
          console.log(err)
          setUpdating(false)
        }

      } else {
        newPost.img = postImg
      }
      
      if ((!newPost.desc && !newPost.location) && !newPost.img) {
        navigate("/")
      }

      try {
        await axios.put(`${PF}/api/post/update/${postid.postid}`, newPost)
          .then(() => {
            navigate("/");
            setGetPosts(!getPosts);
            setUpdating(false)
          })
      } catch (error) {
        console.log(error)
      }
  }

  return (
    <div className="sm:boxShadow mx-auto sm:mx-4 my-5 overflow-hidden">
      <div className="sm:p-2 mb-6">
        <div className="w-full">
          {/* edit post description */}
          <span className="text-pink-500 text-xs opacity-50">edit caption</span>
          <textarea type="text" defaultValue={post.desc} placeholder="add a caption" onChange={e => e.target.value ? setUpdateDesc(e.target.value) : setUpdateDesc(post.desc)} className="text-sm text-gray-600 italic focus:outline-none  border-none focus:ring-0  cursor-auto scrollbar-thumb-gray-300 scrollbar-track-gray-200 scrollbar-thin focus:mt-4 w-full" />
          {/* edit post location */}
          <div>
            <span className="text-pink-500 text-xs opacity-50">edit location</span>
            <input type="text" defaultValue={post.location} placeholder="paste location" onChange={e => e.target.value ? setUpdateLocation(e.target.value) : setUpdateLocation(post.location)} className="text-sm italic focus:outline-none border-none focus:ring-0 text-gray-600 text-right" />
          </div>
        </div>
        {/* edit image */}
        <div>
          {
            (post.img && post.img !== " ") && !removeImg ?
              (<div>
                {
                  <div className="relative w-full border p-2">
                    <img src={file ? URL.createObjectURL(file) : (post.img)} className="rounded-sm object-cover lg:object-cover sm:h-[570px] md:h-[420px] lg:h-[570px] h-[420px] w-full" alt="" />
                    <PencilAltIcon
                      onClick={e => chooseImg.current.click()}
                      className="absolute top-0 text-md right-1 h-8 font-bold text-gray-800 bg-white p-1 rounded-lg cursor-pointer" />
                       <span
                      onClick={handleRemvImg}
                      className="absolute top-0 text-md right-10 h-8 font-bold text-gray-800 bg-white p-2 rounded-lg cursor-pointer">X</span>
                    <input type="file" accept="image/*" hidden ref={chooseImg} onChange={e => setFile(e.target.files[0])} />
                  </div>
                }
              </div>
              ) :
              (file ?
                (
                  <div className="relative w-full border p-2">
                    <img src={URL.createObjectURL(file)} className="h-[500px] object-contain mx-auto" alt="" />
                    <span
                      onClick={e => setFile(null)}
                      className="absolute top-1 text-md right-10 h-8 font-bold text-gray-600 bg-white p-2 rounded-lg cursor-pointer">X</span>
                  </div>
                ) :
                (
                  <div className="rounded-sm border mx-auto w-11/12 h-[300px] relative">
                    <div onClick={() => chooseImg.current.click()} className='absolute transform top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 cursor-pointer flex flex-col items-center justify-center'>
                      <PhotographIcon className="h-16 text-gray-400 " />
                      <p className='text-gray-400 font-semibold text-xs'>click to add photo</p>
                    </div>
                    <input type="file" accept="image/*" hidden ref={chooseImg} onChange={e => setFile(e.target.files[0])} />
                  </div>
                )
              )
          }
          <div className='bg-gray-500 w-[90%] mx-auto h-[1px] mt-20' />
          <div className="flex items-center justify-center gap-2 w-full">
            <Link to="/">
              <button onClick={updatePost} className="bg-gray-500 rounded-md p-2 !px-5 text-white text-sm font-semibold mt-5 mr-2">
                Back
              </button>
            </Link>
            <button onClick={updatePost} className="bg-green-500 rounded-md p-2 text-white text-sm font-semibold mt-5 mr-2">
              {updating ? 'Updating...' : 'Update'}
            </button>
            <div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
