import axios from "axios";


export const loginCall = async (userCredentials, dispatch) => {
    dispatch({type: "LOGIN_START"});
    try {
        await axios.post("http://localhost:8800/api/user/signin", userCredentials)
        .then(res => (dispatch({type: "LOGIN_SUCCESS", payload:res.data})))
    } catch (err) {
        dispatch({type: "LOGIN_FAILURE", payload:err})
    }
}

export const signupCall = async (userCredentials, dispatch) => {
    dispatch({type: "LOGIN_START"});
    try {
        await axios.post("http://localhost:8800/api/user/create", userCredentials)
        .then(res => dispatch({type: "LOGIN_SUCCESS", payload:res.data}))
    } catch (err) {
        dispatch({type: "LOGIN_FAILURE", payload:err})
    }
}
