import Http from '../Http'
import {baseUrl} from '../config/app'

const test = {
    check(method,url, data) {
        return new Promise((resolve, reject) => {
            Http?.[method](baseUrl + url, data)
            .then(function (res) {
                return resolve(res.data);
            })
            .catch(function (err) {
                // handle error
                let errorData, statusCode
                if(err.response !== undefined) {
                    errorData = err.response.data.errors
                    statusCode = err.response.status
                }
                return reject({errorData,statusCode});
            })
        })

    }
}
export default test;