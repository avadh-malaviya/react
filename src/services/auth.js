import Http from '../Http'
import {baseUrl} from '../config/app'
import * as action from './../store/actions'
const auth = {
    getCompareFlag(data) {
        return new Promise((resolve, reject) => {
            Http.post(baseUrl + 'auth/getcompareflag', data)
            .then(function (res) {
                // handle success
                return resolve(res.data);
            })
            .catch(function (err) {
                // handle error
                return reject(err);
            })
        })
    },
    login(dispatch, data) {
        return new Promise((resolve, reject) => {
            dispatch(action.authRequest());
            Http.post(baseUrl + 'auth/login', data)
            .then(function (res) {
                // handle success
                if(res?.data?.code===200) {
                    dispatch(action.authLogin(res));
                    return resolve(res.data);
                }else{
                    if(res?.data?.code !== '402'){
                        dispatch(action.authError({error: res?.data?.message, code: res?.data?.code}));
                    }
                    return reject(res?.data);
                }
            })
            .catch(function (err) {
                // handle error
                dispatch(action.authError({error: err}));
                return reject(err);
            })
        })
    },
    sendPassword(username, attempt, agentid) {
        return new Promise((resolve, reject) => {
            Http.post(baseUrl + 'auth/sendpassword', {username, attempt, agentid})
            .then( (res) => resolve(res.data) )
            .catch( (err) => reject(err) )
        })
    },
    sendExpiryMail(username, expiry_day) {
        return new Promise((resolve, reject) => {
            Http.post(baseUrl + 'auth/sendexpirymail', {username, expiry_day})
            .then( (res) => resolve(res.data) )
            .catch( (err) => reject(err) )
        })
    },
    logout(dispatch) {
        dispatch(action.authLogout());
    }
}
export default auth;