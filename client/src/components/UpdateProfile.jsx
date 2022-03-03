
import { CameraIcon, PhotographIcon, UserCircleIcon, XIcon } from "@heroicons/react/solid";
import axios from "axios";
import { useContext, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

export default function UpdateProfile() {
    const navigate = useNavigate()
    const {user, dispatch} = useContext(AuthContext)
    const profilePic = useRef()
    const coverPhoto = useRef()
    const [ppFile, setPpFile] = useState(null)
    const [coverFile, setCoverFile] = useState(null)
    const [editPP, setEditPP] = useState(false)
    const [editCover, setEditCover] = useState(false)
    const [PP, setPP] = useState(user.profilePicture)
    const [CP, setCP] = useState(user.coverPhoto)
    const [updating, setUpdating] = useState(false)

    const userBio = useRef()
    const userCity = useRef()
    const userFrom = useRef()
    const userRelationship = useRef()

    const deletePP = async () => {
        setEditPP(false)
        try {
          await axios.delete(`http://localhost:8800/api/rmvimage/${user.profilePicture}`) 
          await axios.put(`http://localhost:8800/api/user/update/${user._id}`, {userID:user._id, profilePicture: ' '})
          const getUpdatedUser = await axios.get(`http://localhost:8800/api/user/${user._id}`)
          console.log(getUpdatedUser)
          dispatch({type: "LOGIN_SUCCESS", payload:getUpdatedUser.data});
          setPP(null)
        } catch (error) {
            console.log(error)
        }
    }
    const deleteCP = async () => {
        setEditCover(false)
        try {
          await axios.delete(`http://localhost:8800/api/rmvimage/${user.coverPhoto}`) 
          await axios.put(`http://localhost:8800/api/user/update/${user._id}`, {userID:user._id, coverPhoto: ' '})
          const getUpdatedUser = await axios.get(`http://localhost:8800/api/user/${user._id}`)
          console.log(getUpdatedUser)
          dispatch({type: "LOGIN_SUCCESS", payload:getUpdatedUser.data});
          setCP(null)
        } catch (error) {
            console.log(error)
        }
    }
    const updateProfile = async () => {
        setUpdating(true)
        const newUser = {
            userID:user._id,
        }
        userBio.current.value && (newUser.bio = userBio.current.value);
        userCity.current.value && (newUser.city = userCity.current.value);
        userFrom.current.value && (newUser.from = userFrom.current.value);
        userRelationship.current.value && (newUser.relationship = userRelationship.current.value);
        
        if(coverFile){
            const coverpicture = new FormData()
            const coverName = Date.now() + coverFile.name;
            coverpicture.append("name", coverName);
            coverpicture.append("file", coverFile);
            newUser.coverPhoto = coverName;
            try {
            (user.profilePicture && user.profilePicture != " ") && await axios.delete(`http://localhost:8800/api/rmvimage/${user.profilePicture}`) 
            await axios.post("http://localhost:8800/api/upload", coverpicture)
            } catch (err) {
                console.log(err)
            }
        }
        if(ppFile){
            const newprofilepic = new FormData()
            const ppName = Date.now() + ppFile.name;
            newprofilepic.append("name", ppName);
            newprofilepic.append("file", ppFile);
            newUser.profilePicture = ppName;
            try {
            (user.coverPhoto && user.coverPhoto != " ") && await axios.delete(`http://localhost:8800/api/rmvimage/${user.coverPhoto}`) 
            await axios.post("http://localhost:8800/api/upload", newprofilepic)
            } catch (err) {
                console.log(err)
            }
        }
        
        try {
            const res = await axios.put(`http://localhost:8800/api/user/update/${user._id}`, newUser)
            const getUpdatedUser = await axios.get(`http://localhost:8800/api/user/${user._id}`)
            setUpdating(false)
            dispatch({type: "LOGIN_SUCCESS", payload:getUpdatedUser.data});
            navigate(`/profile`); 
        } catch (err) {
            setUpdating(false)
            console.log(err)
        }
 
    }

  const PF = "http://localhost:8800/images/";

  return (
      <div className="min-h-screen">
          <div className="flex flex-col gap-3">
              <div className="md:pl-3 lg:px-1 mb-7">
                  <div className="relative">
                      {(CP && user.coverPhoto != " ") || coverFile ? <img src={coverFile ? URL.createObjectURL(coverFile) : PF+user.coverPhoto} className="h-60 md:h-80 w-full object-cover rounded-sm" alt="" /> : (
                          <div className="rounded-sm  w-full h-60 bg-gray-200 relative">
                              <PhotographIcon className="h-16 text-gray-400 absolute transform top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 cursor-pointer" />
                          </div>
                      )}
                      <CameraIcon onClick={() => {setEditPP(false); setEditCover(!editCover)}} className="bg-white h-10 p-2  text-pink-400 borderFull absolute bottom-2 right-0 cursor-pointer" />

                      { editCover &&
                         <div className='absolute right-8 -bottom-28  p-2 bg-gray-500 z-10 rounded-md flex flex-col items-start gap-3'>
                        <button onClick={deleteCP} className='text-xs text-white bg-gray-600 p-2 rounded-md'>Delete Cover Photo</button>
                        <button onClick={() => {coverPhoto.current.click(); setEditCover(false)}} className='text-xs text-white bg-gray-600 p-2 rounded-md w-full'>Change Cover Photo</button>
                        <button onClick={() => setEditCover(false)} className='text-xs text-white bg-gray-400 p-2 rounded-md w-full'>Cancel</button>
                        </div>
                     }

                      <input type="file" accept="image/*" hidden ref={coverPhoto} onChange={e => setCoverFile(e.target.files[0])} />
                      {coverFile && <XIcon onClick={() => setCoverFile(null)} className="bg-white h-10 p-2  text-pink-400 borderFull absolute bottom-2 right-11 cursor-pointer" />}
                  </div>
                  <div className="relative">
                      {(PP && user.profilePicture != " ") || ppFile ? <img src={ppFile ? URL.createObjectURL(ppFile) : PF+user.profilePicture} className="h-36 w-36 p-1 object-cover borderFull border-2 bg-white border-white absolute -bottom-28 transform left-1/2 -translate-x-1/2 -translate-y-1/2" alt="" /> : <UserCircleIcon className="h-36 w-36 object-cover borderFull bg-white absolute -bottom-28 transform left-1/2 -translate-x-1/2 -translate-y-1/2 text-gray-300" />}

                      <CameraIcon onClick={() => {setEditCover(false); setEditPP(!editPP)}} className={`text-white h-10 p-2 borderFull absolute transform right-[30%] -bottom-[50px] -translate-x-1/2 -translate-y-1/2 cursor-pointer ${ppFile ? "bg-pink-400 text-white" : "text-pink-400 bg-white"}`} />

                     { editPP &&
                         <div className='absolute right-[26%] -bottom-[225px] -translate-x-1/2 -translate-y-1/2 p-2 bg-gray-500 z-10 rounded-md flex flex-col items-start gap-3'>
                        <button onClick={deletePP} className='text-xs text-white bg-gray-600 p-2 rounded-md'>Delete Profile Picture</button>
                        <button onClick={() => {profilePic.current.click(); setEditPP(false)}} className='text-xs text-white bg-gray-600 p-2 rounded-md w-full'>Change Profile Picture</button>
                        <button onClick={() => setEditPP(false)} className='text-xs text-white bg-gray-400 p-2 rounded-md w-full'>Cancel</button>
                        </div>
                     }
                      <input type="file" accept="image/*" hidden ref={profilePic} onChange={e => setPpFile(e.target.files[0])} />
                      {ppFile && <XIcon onClick={() => setPpFile(null)} className="text-white h-6 p-1  bg-pink-400 borderFull absolute transform right-[40%] -bottom-[47px] -translate-x-1/2 -translate-y-1/2 cursor-pointer" />}
                  </div>
              </div>
              <div className="flex flex-col items-center justify-center">
                  <p className="font-bold text-lg my-3">{user.username}</p>
                  <textarea ref={userBio} placeholder={user.bio || "write something about yourself"} type="text" className=" focus:outline-none border-none focus:ring-0 font-semibold text-gray-700 w-full text-sm scrollbar-thumb-gray-300 scrollbar-track-gray-200 scrollbar-thin cursor-auto text-center" />
              </div>
          </div>

          <div className="my-10 w-full">
              <div className="space-y-3 mt-2 w-full flex flex-col justify-center items-center">
                  <p className="font-bold text-lg text-gray-700">User information</p>
                  <div>
                      <span className="text-gray-400">City:</span>
                      <input type="text" ref={userCity} placeholder={user.city || "where're you at?"} className=" focus:outline-none border-none focus:ring-0 font-semibold text-green-700 text-sm text-right" />
                  </div>
                  <div>
                      <span className="text-gray-400">From:</span>
                      <input type="text" ref={userFrom} placeholder={user.from || "where're you from?"} className=" focus:outline-none border-none focus:ring-0 font-semibold text-green-700 text-sm text-right" />
                  </div>
                  <div className='flex items-center justify-center gap-4'>
                    <span className="text-gray-400">Relationship:</span>
                    <select ref={userRelationship} className="focus:ring-0 focus:outline-none bg-transparent border border-gray-300 rounded-md w-full mx-auto block p-1 !pr-7 text-gray-600">
                    <option value={user?.relationship} >Select Relationship Status</option>
                    <option value="Single">Single</option>
                    <option value="Dating">Dating</option>
                    <option value="Complicated">Complicated</option>
                    </select>
                  </div>
              </div>
          </div>

          <div className="flex items-center justify-between mb-10 mx-10">
              <Link to={`/profile/${user.username}`}>
                  <button className="text-gray-700 border rounded-md border-gray-600 p-2 text-xs">back</button>
              </Link>
              <button onClick={updateProfile} className="bg-green-500 text-white rounded-md p-2 font-semibold text-xs">{updating ? 'Updating...' : 'update profile'}</button>
          </div>

      </div>

  )
}
