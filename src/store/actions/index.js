import * as ActionTypes from '../action-types'

export function authRequest(){
    return {
        type: ActionTypes.AUTH_REQUEST
    }
}

export function authLogin(payload){
    return {
        type: ActionTypes.AUTH_LOGIN,
        payload
    }
}

export function authError(payload){
    return {
        type: ActionTypes.AUTH_ERROR,
        payload
    }
}

export function authLogout(){
    return {
        type: ActionTypes.AUTH_LOGOUT
    }
}

export function authCheck(){
    return {
        type:ActionTypes.AUTH_CHECK
    }
}

export function authVerify(payload){
    return {
        type: ActionTypes.AUTH_VERIFY,
        payload
    }
}

export function authForgot(payload){
    return {
        type: ActionTypes.AUTH_FORGOT,
        payload
    }
}

export function setAlert(payload){
    return {
        type: ActionTypes.SET_ALERT,
        payload
    }
}

export function setUserData(payload){
    return {
        type: ActionTypes.SET_USERDATA,
        payload
    }
}