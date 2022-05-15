import axios from "axios";
import {PF} from "./pf"

export const loginCall = async (userCredentials, dispatch) => {
    dispatch({type: "LOGIN_START"});
    try {
        await axios.post(`${PF}/api/user/signin`, userCredentials)
        .then(res => (dispatch({type: "LOGIN_SUCCESS", payload:res.data})))
    } catch (err) {
        dispatch({type: "LOGIN_FAILURE", payload:err})
    }
}

export const signupCall = async (userCredentials, dispatch) => {
    dispatch({type: "LOGIN_START"});
    try {
        await axios.post(`${PF}/api/user/create`, userCredentials)
        .then(res => dispatch({type: "LOGIN_SUCCESS", payload:res.data}))
    } catch (err) {
        dispatch({type: "LOGIN_FAILURE", payload:err})
    }
}
