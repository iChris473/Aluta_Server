import axios from "axios"
import { useState } from "react"
import { Link } from "react-router-dom"
import { useRecoilState } from "recoil"
import { getPosts, openModal, postID } from "../atoms/modalAtom"
import { ref, deleteObject } from "firebase/storage";
import storage from "../firebase"
import { PF } from "../pf"

export default function Modal() {
  const [deleting, setDeleting] = useState(false)
  const [modalState, setModalState] = useRecoilState(openModal)
  const [getpost, setGetPosts] = useRecoilState(getPosts)
  const [postid, setPostId] = useRecoilState(postID);

  const handleDelete = async () => {
    setDeleting(true)

    try {
      // delete previous file
      if(postid.postImg != '' && postid.postImg){
          const deleteRef = ref(storage, `${postid.postImg}`)
          // Delete the file
          deleteObject(deleteRef).then(() => {
            // File deleted successfully
            console.log('old picture deleted')
          }).catch((error) => {
            // Uh-oh, an error occurred!
            console.log(error)
          });

        }

        await axios.delete(`${PF}/api/post/delete/${postid.postid}`)
          .then(() => {
            setDeleting(false)
            setModalState(false);
            setGetPosts(!getpost);
            setPostId()
          })
        } catch (err) {
        setDeleting(false)
        console.log(err)
      }
  }

  return (
    <div>
        <div onClick={() => setModalState(false)} className="absolute bg-gray-300 opacity-70 w-screen z-10 top-0 h-screen" />
        <div className="bg-white opacity-100 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 rounded-lg z-50 w-[300px] p-5">
            <div className="flex gap-3 items-center justify-center">
                <button onClick={handleDelete} className="hover:border-2 border p-2 text-gray-700 rounded-md cursor-pointer border-red-600">
                  {deleting ? "deleting..." : "delete post"}
                </button>
                <Link to={`/editpost/${postid.postid}`} >
                  <button onClick={() => setModalState(false)} className="hover:scale-110 border text-sm border-blue-600 text-gray-700 cursor-pointer p-2 rounded-md">edit post
                  </button>
                </Link>
            </div>
        </div>
  </div>
  )
}
