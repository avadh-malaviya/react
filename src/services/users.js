import Http from '../Http'

const baseURL = ""
const users = {
    get() {
        return new Promise((resolve, reject) => {
            Http.get('./../data/users.json')
            .then(function (res) {
                // handle success
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
export default users;