import Http from '../Http'
import {baseUrl} from '../config/app'

const chatService = {
    reactunreadcount() {
        return new Promise((resolve, reject) => {
            Http.get(baseUrl + 'chat/reactunreadcount')
            .then( (res) => resolve(res.data) )
            .catch( (err) => reject(err) )
        })
    },
}
export default chatService;