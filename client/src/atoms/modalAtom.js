import {atom} from "recoil"

export const openModal = atom({
    key:"modalState",
    default:false
})
export const settingsModal = atom({
    key:"settingModal",
    default:false
})

export const postID = atom({
    key:"postIdState",
    default:""
})

export const getPosts = atom({
    key:"getPostState",
    default:false
})
export const getAMessage = atom({
    key:"getMessage",
    default:[]
})
export const activeUsers = atom({
    key:"activeUsers",
    default:[]
})
export const followers = atom({
    key:"followers",
    default:[]
})
export const chatTopbar = atom({
    key:"chatTopbar",
    default:[]
})
export const setFollows = atom({
    key:"setFollows",
    default:false
})
export const commentSection = atom({
    key:"comment",
    default:false
})
export const commentLength = atom({
    key:"commentLenght",
    default: false
})
export const filteredUsers = atom({
    key:"filteredUsers",
    default: ''
})
export const editCommentModal = atom({
    key:"editCommentModal",
    default: false
})
export const commentData = atom({
    key:"commentData",
    default: {}
})
export const logoutModal = atom({
    key:"LogoutModal",
    default: false
})
export const chatScreen = atom({
    key:"mobileScreen",
    default: false
})
export const mobilView = atom({
    key:"mobilView",
    default: false
})

