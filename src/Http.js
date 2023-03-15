import axios from 'axios'
import { Buffer } from "buffer";
import Base64 from './Base64';
global.Buffer = Buffer

const { base64encode, base64decode } = require('nodejs-base64');

// axios.defaults.headers.common['Access-Control-Allow-Origin'] = '*';
// axios.defaults.headers.common['Content-Type'] = 'application/json';

let token = localStorage.getItem('access_token') ? localStorage.getItem('access_token') : '';

let currentUser = localStorage.getItem('currentUser') ? JSON.parse(localStorage.getItem('currentUser')) : {
    id: 0,
    override: 0,
};
function setBearerToken(id, token) {
    let xencode = base64encode(id + ':' +token)
    let encode = Base64.encode(id + ':' +token);
    console.log('base64encode', xencode);
    console.log('Base64.encode', encode);
    axios.defaults.headers.common['Authorization'] = `Basic ${encode}`;
    // axios.defaults.headers.common['Connection'] = `keep-alive`;

    // axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
}
if(token!==''){
    setBearerToken(currentUser?.id, token);
}

async function AxiosMiddleware (method, url, data, options) {
    options = Object.assign({
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
    }, options);
    switch(method) {
        case 'post':
        return axios.post(url, data, options);
        case 'head':
        return axios.head(url, data, options);
        case 'patch':
        return axios.patch(url, data, options);
        case 'put':
        return axios.put(url, data, options);
        case 'delete':
        return axios.delete(url, {data:data, headers: options});
        default:
        return axios.get(url, {params:data}, options);
    }

}
const _axios = {
    get: (url, data = [], options = {}) => {
        return AxiosMiddleware('get', url, data, options)
    },
    post: (url, data = [], options = {}) => {
        return AxiosMiddleware('post', url, data, options)
    },
    head: (url, data = [], options = {}) => {
        return AxiosMiddleware('head', url, data, options)
    },
    patch: (url, data = [], options = {}) => {
        return AxiosMiddleware('patch', url, data, options)
    },
    put: (url, data = [], options = {}) => {
        return AxiosMiddleware('put', url, data, options)
    },
    delete: (url, data = [], options = {}) => {
        return AxiosMiddleware('delete', url, data, options)
    },
    setBearerToken: setBearerToken,
    removeBearerToken: () => {
        delete axios.defaults.headers.common['Authorization'];
    }
}
export default _axios;