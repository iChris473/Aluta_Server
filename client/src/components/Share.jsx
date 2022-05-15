import { LocationMarkerIcon, PhotographIcon} from "@heroicons/react/outline"
import { UserCircleIcon } from "@heroicons/react/solid"
import axios from "axios";
import { useContext, useRef, useState } from "react"
import { useRecoilState } from "recoil";
import { getPosts } from "../atoms/modalAtom";
import { AuthContext } from "../context/AuthContext";
import { ref, getDownloadURL, uploadBytes } from "firebase/storage";
import storage from "../firebase"
import {PF} from "../pf"

export default function Share() {
  const {user} = useContext(AuthContext)
  const [getpost, setGetPosts] = useRecoilState(getPosts)
  const chooseImg = useRef()
  const [file, setFile] = useState(null)
  const [location, setLocation] = useState(null)
  const [locationInput, setLocationInput] = useState(false)
  const [loading, setLoading] = useState(false)
  const [emptyDesc, setEmptyDesc] = useState(true)
  const postDesc = useRef()

  
  const handleSubmitPost = async () => {
    if(file || location || postDesc){
            setLoading(true)
      const newPost = {
        userID: user._id,
        desc: postDesc.current.value,
        location,
      }
      if(file){
        // const data = new FormData();
        // const filename = Date.now() + file.name;
        // data.append("name", filename);
        // data.append("file", file);

        const firebaseImageRef = ref(storage, `${file.name}`)

        const metadata = {
          contentType: 'image/jpeg',
        };
        
        // Upload the file and metadata
        try {
          // const uploadTask = uploadBytes(storageRef, file, metadata)
          await uploadBytes(firebaseImageRef, file, metadata)
          .then(async snapshot => {
            const downloadURL = await getDownloadURL(firebaseImageRef)
            newPost.img = downloadURL;
          })
        } catch (err){
          console.log(err)      
        }
      }
  
      try {
        await axios.post(`${PF}/api/post/create`, newPost)
        .then(() =>  {
          setLoading(false)
          setGetPosts(!getpost)
          setFile(null);
          setLocation("");
          setLocationInput(false);
          postDesc.current.value = null;
        })
      } catch (err) {
        setLoading(false)
      }
    }
  }


  return (
      <div className="boxShadow mx-2 mt-2 sm:mx-4 overflow-x-hidden p-5">
        <div className="flex flex-col  gap-5">
          <div className="flex gap-2">
          {user.profilePicture ?
                  <img alt="" className="borderFull h-12 w-12 object-cover" src={user.profilePicture} alt="" />  : 
                  <UserCircleIcon className="h-12 w-12 text-gray-400" />
                }
            <textarea type="text" rows="3" placeholder={`what's on your mind ${user.username} ?`} className="text-sm focus:outline-none  border-none focus:ring-0 flex-1 cursor-auto scrollbar-thumb-gray-300 scrollbar-track-gray-200 scrollbar-thin" ref={postDesc} onChange={e => e.target.value == "" ? setEmptyDesc(true) : setEmptyDesc(false)} />
          </div>
          <hr className="bg-gray-300 h-[2px]" />
                {file && 
                <div className="relative mx-auto">
                  <img src={URL.createObjectURL(file)} className="rounded-sm object-cover lg:object-cover sm:h-[570px] md:h-[420px] lg:h-[570px] h-[420px] w-full" alt="" />
                  <span 
                  onClick={e => setFile(null)}
                  className="absolute -top-2 text-md right-0 h-8 font-bold text-gray-600 bg-white p-2 rounded-lg cursor-pointer">X</span>
                </div>
                  }
          <div className="flex items-center justify-between">
            <div className="flex space-x-4 flex-1">

                <PhotographIcon onClick={() => chooseImg.current.click()} className="cursor-pointer h-5 sm:h-6 text-red-500" /> 

                <input type="file" accept="image/*" hidden ref={chooseImg} onChange={e => setFile(e.target.files[0])} /> 
                  <LocationMarkerIcon id="locationMarker" onClick={e => setLocationInput(!locationInput)} className="h-5 sm:h-6 text-gray-600 cursor-pointer" />
                  {locationInput &&
                    <input type="text" onChange={e => e.target.value.trim() && setLocation(e.target.value)} placeholder="where are you at?" className="text-sm focus:outline-none border-none h-5 sm:h-6 text-gray-400 focus:ring-0" />
                  }
                  {
                  (location && !locationInput) && 
                  <div className="relative">
                    <span className="italic text-yellow-600 font-semibold">{`@${location}`}</span>
                    <span 
                    onClick={() => setLocation(null)}
                    className="absolute top-0 text-xs -right-2 text-red-600 cursor-pointer">X</span>
                  </div>
                  }

            </div>
            <div>
              <button onClick={handleSubmitPost} disabled={(!file && !location) && emptyDesc} className="bg-green-400 rounded-md hover:bg-green-600 p-1 sm:p-2 text-sm text-center text-white disabled:bg-gray-300 disabled:hover:bg-gray-400">{loading ? "posting..." : "Share"}</button>
            </div>
          </div>
        </div>
    </div>
  )
}
