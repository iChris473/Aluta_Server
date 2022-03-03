
import { useRecoilState } from "recoil";
import { openModal } from "../atoms/modalAtom";
import Rightbar from "../components/Rightbar";
import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";
import UpdatePost from "../components/UpdatePost";

export default function EditPost() {
  const [modalState, setModalState] = useRecoilState(openModal)
  return (
    <>
    <div className="relatiive overflow-x-hidden h-screen">
      <Topbar />
      <div className=" grid overflow-hidden grid-cols-11">
        <div className="hidden md:inline-grid col-span-2">
          <Sidebar />
        </div>
        <div className="col-span-12 md:col-span-6">
          <UpdatePost />
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
