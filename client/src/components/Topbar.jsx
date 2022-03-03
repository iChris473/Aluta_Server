
import { SearchIcon, ChatIcon, MenuAlt3Icon, XIcon, CogIcon } from "@heroicons/react/outline";
import { ArrowLeftIcon, UserCircleIcon } from "@heroicons/react/solid";
import logo from "../assets/aluta_logo.png"
import Sidebar from "./Sidebar";
import { useEffect, useState} from "react";
import { Link } from "react-router-dom";
import { useContext } from "react"
import { AuthContext } from "../context/AuthContext";
import ChatSideBar from "./messenger/ChatSideBar";
import { activeUsers, chatScreen, chatTopbar, commentSection, editCommentModal, filteredUsers, getAMessage, getPosts, logoutModal, openModal, settingsModal } from "../atoms/modalAtom";
import { useRecoilState } from "recoil";
import axios from "axios";
import { useNavigate } from "react-router-dom"
import {PF} from "../pf"

export default function Topbar({messenger, home, profile, userPofile}) {

  const {user, socketUser} = useContext(AuthContext)
  const [chatBar, setChatBar] = useRecoilState(chatTopbar)
  const [chatView, setChatView] = useRecoilState(chatScreen)
  const [conversation, setConversation] = useRecoilState(getAMessage)
  const [onlineUsers, setOnlineUsers] = useRecoilState(activeUsers)
  const [searchedUsers, setSearchedUsers] = useRecoilState(filteredUsers)
  const [mobile, setMobile] = useState(false)
  const [openSetting, setOpenSetting] = useRecoilState(settingsModal)
  const [getpost, setGetPosts] = useRecoilState(getPosts)
  const navigate = useNavigate()

  // Modals
  const [modalState, setModalState] = useRecoilState(openModal)
  const [commentMode, setCommentMode] = useRecoilState(commentSection)
  const [editCommentMode, setEditCommentMode] = useRecoilState(editCommentModal)
  const [logout, setLogout] = useRecoilState(logoutModal)

  useEffect(() => {
    (modalState || openSetting || commentMode || editCommentMode || logout) && setMobile(false)
  }, [modalState, openSetting, commentMode, editCommentMode, logout])

  const handleMenu = () => {
    setMobile(!mobile)
  }
  const getUserData = async e => {
    localStorage.setItem("currentUser", null)
    localStorage.setItem("currentUser", JSON.stringify(chatBar))
    setChatBar([])
    navigate("/friend/profile")
  }

  return (
    <header className={`bg-gray-100 py-2 border-b shadow-sm ${messenger ? "fixed w-full" : "sticky"} z-50 top-0`}>
      <div className="flex flex-row items-center justify-between  max-w-5xl sm:mx-2 lg:mx-auto">
        {/* Left Div */}
        <div className="flex items-center ml-3">
          <div onClick={() => {setChatBar([]); setConversation([]);}} className="" >
            {chatBar.length == 0 ?
              <Link to={"/"}>
              <img src={logo} className="w-20" alt="" />
            </Link> :
              <ArrowLeftIcon onClick={() => {setConversation([]); setChatView(false)}} className="w-6 cursor-pointer text-gray-500" />}
          </div>
            {chatBar.length !== 0 &&
            <div onClick={getUserData} className="flex items-center cursor-pointer">
              {chatBar.profilePicture ? <img src={PF + chatBar.profilePicture} className="w-12 h-12 m-3 object-cover borderFull" alt="" /> : <UserCircleIcon className="h-12 m-3 text-gray-500" />}
              <div className="flex flex-col">
                <p className="text-gray-600 text-lg font-semibold ">{chatBar.username}</p>
                {socketUser.some(o => o.userId == chatBar._id) && <p className="text-gray-600 text-xs">online</p>}
              </div>
            </div>
              }

        </div>

        {/* Center Div */}
        {!messenger && chatBar.length == 0 &&
         <div className=" bg-white h-10 rounded-r-full rounded-l-full pl-5 flex" >
          <div className="mt-3">
            <SearchIcon className="h-5 text-gray-600 pr-1 cursor-pointer" />
          </div>
          <input type="text" onChange={e => setSearchedUsers(e.target.value)} placeholder="Search" className="text-xs rounded-r-full rounded-l-full focus:outline-none border-none focus:ring-0" />
        </div>}

        {/* Right Div */}
       {chatBar.length == 0 &&
        <div className="rightDiv flex items-center ">
          <div className="topbarIcons  hidden space-x-1 md:flex gap-2 p-5 items-center">
            <Link to="/messenger">
                <ChatIcon className="h-5 text-gray-600" />
            </Link>
              <CogIcon onClick={() => setOpenSetting(true)} className="h-5 text-gray- cursor-pointer" />
          </div>
          {
            !mobile ? <MenuAlt3Icon onClick={handleMenu} className="h-5 md:hidden text-gray-600 mr-2" /> :
            <XIcon onClick={handleMenu} className="h-5 md:hidden sm:mr-2" />
          } 
          <Link to={"/profile"}>
              {user.profilePicture && user.profilePicture !== " " ?
                <img className="h-8 w-8 hidden sm:inline-block  sm:h-10 sm:w-10 borderFull object-cover" src={PF+user.profilePicture} alt="" />  : 
                <UserCircleIcon className="h-8 w-8 hidden sm:inline-block text-gray-400 sm:h-10 sm:w-10" />
              }
          </Link>
        </div>}
        {/* ChatBar div */}
        {
          !chatTopbar && chatBar.length !== 0 && (
            <div className>
              {
                !mobile ? 
                <MenuAlt3Icon onClick={handleMenu} className="h-5 md:hidden text-gray-600 mr-2" /> :
                <XIcon onClick={handleMenu} className="h-5 md:hidden sm:mr-2" />
              }
            </div>
          )
        }
        {mobile && (messenger ? <ChatSideBar /> : <Sidebar homePage />)}
      </div>
    </header>
  )
}
