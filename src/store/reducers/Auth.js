import * as ActionTypes from '../action-types'
import Http from '../../Http'

let token = localStorage.getItem('access_token') ? localStorage.getItem('access_token') : '';
let currentUser = localStorage.getItem('currentUser') ? JSON.parse(localStorage.getItem('currentUser')) : {
    id: 0,
    override: 0,
};

export const initialState = {
    isAuthenticated : false || !!localStorage.getItem('access_token'),
	token: '' || token,
    user: currentUser,
	loading: false,
	errorMessage: null,
};

const authRequest = (state) => {
    state = Object.assign({}, state, {
        loading: true,
    });
    return state;
}

const authLogin = (state,payload) => {
    const user = payload.data.user;
    const accessToken = user.access_token;
    localStorage.setItem('access_token',accessToken);
    localStorage.setItem('currentUser', JSON.stringify(user));


    Http.setBearerToken(user.id, accessToken);

    state = Object.assign({}, state, {
        isAuthenticated: true,
        token: accessToken,
        user: user,
        loading: false,
    });
    return state;

};

const authError = (state,payload) => {
    let code = payload.code;
    let user = currentUser;
    if(code === '402') {
        user.override = 1
        localStorage.setItem('currentUser', JSON.stringify(user));
    }
    state = Object.assign({}, state, {
        loading: false,
        errorMessage: payload.error,
        user
    });
    return state;
}

const authForgot = (state, payload) => {
    const user = payload.data.user;
    const accessToken = user.token;
    localStorage.setItem('access_token',accessToken);
    localStorage.setItem('currentUser', JSON.stringify(user));

    Http.setBearerToken(accessToken);

    state = Object.assign({}, state, {
        isAuthenticated: true,
    });
    return state;

};

const checkAuth = (state) =>{
    state =Object.assign({},state,{
        isAuthenticated : !!localStorage.getItem('access_token'),
    });
    if(state.isAuthenticated){
        Http.setBearerToken(`${localStorage.getItem('access_token')}`);
    }
    return state;
};

const logout = (state) => {
    localStorage.removeItem('access_token');
    Http.removeBearerToken();
    state = Object.assign({},state,{
        isAuthenticated: false,
    });
    return state;
};

const setAlert = (state, payload) =>{

    state =Object.assign({},state,{
        hasAlert : !!payload.message,
        alertMessage : payload.message,
        alertType : payload.type,
    });

    return state;
};

const setUserData = (state,payload) => {
    state = Object.assign({}, state, {
        userData: payload.data,
    });
    return state;
}

export const AuthReducer = (state= initialState,{type,payload = null}) => {
    switch(type){
        case ActionTypes.AUTH_REQUEST:
            return authRequest(state);
        case ActionTypes.AUTH_LOGIN:
            return authLogin(state,payload);
        case ActionTypes.AUTH_ERROR:
            return authError(state,payload);
        case ActionTypes.AUTH_CHECK:
            return checkAuth(state);
        case ActionTypes.AUTH_LOGOUT:
            return logout(state);
        case ActionTypes.AUTH_FORGOT:
            return authForgot(state, payload);
        case ActionTypes.SET_ALERT:
            return setAlert(state, payload);
        case ActionTypes.SET_USERDATA:
            return setUserData(state, payload);
        default:
            return state;
    }
};