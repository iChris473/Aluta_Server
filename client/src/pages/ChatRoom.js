
import {  useEffect, useState } from "react";
import { useRecoilState } from "recoil";
import { chatScreen, mobilView, settingsModal } from "../atoms/modalAtom";
import ChatFeed from "../components/messenger/ChatFeed";
import ChatSideBar from "../components/messenger/ChatSideBar";
import SettingsModal from "../components/SettingsModal";
import Topbar from "../components/Topbar";



export default function ChatRoom() {

  const [openSetting, setOpenSetting] = useRecoilState(settingsModal)
  const [chatView, setChatView] = useRecoilState(chatScreen)
  const [mobileScreen, setMobileScreen] = useState(false)

    useEffect(() => {
      setMobileScreen(chatView)
    },[chatView])
  
  return (
    <div className={`${openSetting && "relatiive overflow-x-hidden h-screen overflow-y-hidden"}`}>
          <Topbar messenger />
          {openSetting && <SettingsModal />}
          <div className="h-screen overflow-hidden grid space-x-5 grid-cols-5">
              <div className={`col-span-5 md:col-span-2 ${mobileScreen && 'md:inline-grid hidden'}`}>
                <ChatSideBar />
              </div>
              <div className={`hidden md:inline-grid md:col-span-3  md:border-l pt-1 border-gray-200 ${mobileScreen && "!inline-grid col-span-5"}`}>
                <ChatFeed />
              </div>
          </div>
    </div>
  )
}
