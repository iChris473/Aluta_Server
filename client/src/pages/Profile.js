
import Feed from "../components/Feed";
import Rightbar from "../components/Rightbar";
import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";
import Cover from "../components/Cover";
import { commentSection, openModal, settingsModal } from "../atoms/modalAtom";
import { useRecoilState } from "recoil";
import SettingsModal from "../components/SettingsModal";
import CommentModal from "../components/CommentModal";
import Modal from "../components/Modal";

export default function Profile() {
    const [openSetting, setOpenSetting] = useRecoilState(settingsModal)
    const [commentMode, setCommentMode] = useRecoilState(commentSection)
    const [modalState, setModalState] = useRecoilState(openModal)


  return (
    <div className={`${(openSetting || commentMode || modalState) && "relatiive overflow-x-hidden h-screen overflow-y-hidden"}`}>
    <Topbar />
    {openSetting && <SettingsModal />}
    {commentMode && <CommentModal />}
    {modalState && <Modal />}
    <div className="grid grid-cols-11">
        <div className="hidden md:inline-grid col-span-2">
            <Sidebar />
        </div>
        <div className="col-span-11 md:col-span-9">
            <Cover />
            <div className="flex flex-col-reverse md:grid md:grid-cols-9">
                <div className=" md:col-span-6">
                    <Feed profile />
                </div>
                <div className=" md:inline-grid md:col-span-3">
                    <Rightbar profile />
                </div>
            </div>
        </div>
    </div>
  </div>
  )
}
