
import {createContext, useEffect, useReducer, useRef, useState} from "react";
import AuthReducer from "./Reducer";
import {io} from "socket.io-client"


const INTITIAL_STATE = {
    user: JSON.parse(localStorage.getItem("user")) || null,
    isFetching: false,
    error: false,
    getPost: false
};

export  const AuthContext = createContext(INTITIAL_STATE);

export const AuthContextProvider = ({children}) => {

    const socket = useRef()
    const [socketUser, setSocketUser] = useState([])
  // create connection to socket server
    useEffect(() => {
      socket.current = io("ws://localhost:8900")
    }, [])

    const [state, dispatch] = useReducer(AuthReducer, INTITIAL_STATE);
    const [currentUser, setCurrentUser] = useState(null)
    useEffect(() => {
        localStorage.setItem("user", JSON.stringify(state.user));
        setCurrentUser(JSON.parse(localStorage.getItem("user")))
    }, [state.user])
    // send userid to socket server
    useEffect(() => {
        currentUser && socket?.current?.emit("addUser", currentUser._id)
        currentUser && socket?.current?.on("getUsers", users => setSocketUser(users))
    }, [currentUser])

    return (
        <AuthContext.Provider 
            value={{
                user: state.user,
                isFetching: state.isFetching,
                error: state.error,
                dispatch,
                socket,
                socketUser
            }}
        >
            {children}
        </AuthContext.Provider>
    )
}