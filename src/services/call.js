import Http from '../Http'
import {baseUrl} from '../config/app'

const callService = {
    reactagentstatus() {
        return new Promise((resolve, reject) => {
            Http.get(baseUrl + 'call/reactagentstatus')
            .then( (res) => resolve(res.data) )
            .catch( (err) => reject(err) )
        })
    },
}
export default callService;