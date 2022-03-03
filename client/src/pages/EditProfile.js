

import Rightbar from "../components/Rightbar";
import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";
import UpdateProfile from "../components/UpdateProfile";


export default function EditProfile() {

  return (
    <>
    <div className="relatiive overflow-x-hidden h-screen">
      <Topbar />
      <div className=" grid grid-cols-11">
        <div className="hidden md:inline-grid col-span-2">
          <Sidebar />
        </div>
        <div className="col-span-12 md:col-span-6">
          <UpdateProfile />
        </div>
        <div className="hidden md:inline-grid col-span-3">
          <Rightbar />
        </div>
      </div>
      <div>
      </div>
    </div>
  </>
  )
}
