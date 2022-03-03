
import { useContext } from "react"
import { useRecoilState } from "recoil"
import { logoutModal } from "../atoms/modalAtom"
import { AuthContext } from "../context/AuthContext"


export default function LogoutModal() {
  const [logout, setLogout] = useRecoilState(logoutModal)
  const {dispatch} = useContext(AuthContext)

  const handleLogout = () => {
    setLogout(false)
    dispatch({type: "LOGIN_SUCCESS", payload:null})
    localStorage.setItem("user", null)
}
  return (
    <div>
        <div className="absolute bg-gray-300 opacity-70 w-screen z-10 top-0 h-screen" />
        <div className="bg-white opacity-100 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 rounded-lg z-50 w-[300px] p-5">
          <h2 className='text-gray-600 text-lg text-center my-5'>Are you sure?</h2>
            <div className="flex gap-3 items-center justify-center">
              <button onClick={() => setLogout(false)} className="hover:border-2 border p-2 text-gray-700 rounded-md cursor-pointer border-red-600">
                Cancel
              </button>
              <button onClick={handleLogout} className="hover:scale-110 border text-sm border-blue-600 text-gray-700 cursor-pointer p-2 rounded-md">
                Log Out
              </button>
            </div>
        </div>
  </div>
  )
}
