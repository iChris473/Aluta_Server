
import { useRecoilState } from "recoil";
import { commentSection, editCommentModal, logoutModal, openModal, settingsModal } from "../atoms/modalAtom";
import Feed from "../components/Feed";
import Modal from "../components/Modal";
import Rightbar from "../components/Rightbar";
import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";
import SettingsModal from "../components/SettingsModal";
import CommentModal from "../components/CommentModal";
import UpdateComment from "../components/UpdateComment";
import LogoutModal from "../components/LogoutModal";

export default function Home() {

  const [modalState, setModalState] = useRecoilState(openModal)
  const [openSetting, setOpenSetting] = useRecoilState(settingsModal)
  const [commentMode, setCommentMode] = useRecoilState(commentSection)
  const [editCommentMode, setEditCommentMode] = useRecoilState(editCommentModal)
  const [logout, setLogout] = useRecoilState(logoutModal)

  return (
    <>
      <div className={`${(modalState || openSetting || commentMode || editCommentMode || logout)  && "relatiive overflow-x-hidden h-screen overflow-y-hidden"}`}>
        <Topbar />
        {modalState && <Modal />}
        {openSetting && <SettingsModal />}
        {commentMode && <CommentModal />}
        {editCommentMode && <UpdateComment />}
        {logout && <LogoutModal />}
        <div className=" grid overflow-x-hidden grid-cols-11">
          <div className="hidden md:inline-grid col-span-2">
            <Sidebar home />
          </div>
          <div className={ (modalState || openSetting || commentMode || editCommentMode || logout) ? 'screenH col-span-12 md:col-span-6' : "col-span-12 md:col-span-6" } >
            <Feed home={true} />
          </div>
          <div className="hidden md:inline-grid col-span-3">
            <Rightbar />
          </div>
        </div>
      </div>
    </>
  )
}
