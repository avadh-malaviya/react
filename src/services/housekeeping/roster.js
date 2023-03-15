import Http from '../../Http'
import {baseUrl} from '../../config/app'

const rosterService = {
    // hskp Dept. Function List
    hskpdeptfunclist(data) {
        return new Promise((resolve, reject) => {
            Http.post(baseUrl + 'frontend/hskp/hskpdeptfunclist', data)
            // Http.get("./../data/housekeeping/roster/hskpdeptfunclist.json")
            .then( (res) => resolve(res.data) )
            .catch( (err) => reject(err) )
        })
    },
    // hskp Device List
    hskpdevicelist(data) {
        return new Promise((resolve, reject) => {
            Http.post(baseUrl + 'frontend/hskp/hskpdevicelist', data)
            // Http.get("./../data/housekeeping/roster/hskpdevicelist.json")
            .then( (res) => resolve(res.data) )
            .catch( (err) => reject(err) )
        })
    },
    // buildList
    buildList(data) {
        return new Promise((resolve, reject) => {
            Http.post(baseUrl + 'build/list', data)
            // Http.get("./../data/housekeeping/roster/build-list.json")
            .then( (res) => resolve(res.data) )
            .catch( (err) => reject(err) )
        })
    },

    // Get Floor List
    getfloorlist(data) {
        return new Promise((resolve, reject) => {
            Http.post(baseUrl + 'frontend/guestservice/getfloorlist', data)
            // Http.get("./../data/housekeeping/roster/getfloorlist.json")
            .then( (res) => resolve(res.data) )
            .catch( (err) => reject(err) )
        })
    },

    // Get Room List Unassign
    getroomlistunassign(data) {
        return new Promise((resolve, reject) => {
            Http.post(baseUrl + 'frontend/guestservice/getroomlistunassign', data)
            // Http.get("./../data/housekeeping/roster/getroomlistunassign.json")
            .then( (res) => resolve(res.data) )
            .catch( (err) => reject(err) )
        })
    },

    addpreference(data) {
      return new Promise((resolve, reject) => {
        Http.post(baseUrl + "frontend/guestservice/addpreference", data)
        // Http.get("./../data/housekeeping/roster/addpreference.json")
          .then((res) => resolve(res.data))
          .catch((err) => reject(err));
      });
    },

    updaterosterdevice(data) {
        return new Promise((resolve, reject) => {
        Http.post(baseUrl + "frontend/guestservice/updaterosterdevice", data)
        // Http.get("./../data/housekeeping/roster/updaterosterdevice.json")
            .then((res) => resolve(res.data))
            .catch((err) => reject(err));
        });
    },

    getrosters(data) {
        return new Promise((resolve, reject) => {
        Http.post(baseUrl + "frontend/guestservice/getrosters", data)
        // Http.get("./../data/housekeeping/roster/getrosters.json")
            .then((res) => resolve(res.data))
            .catch((err) => reject(err));
        });
    },

    floorList(data) {
        return new Promise((resolve, reject) => {
        Http.post(baseUrl + "floor/list", data)
        // Http.get("./../data/housekeeping/roster/floor-list.json")
            .then((res) => resolve(res.data))
            .catch((err) => reject(err));
        });
    },
    hskpjobrolelist(data) {
        return new Promise((resolve, reject) => {
            Http.post(baseUrl + 'frontend/hskp/hskpjobrolelist', data)
            // Http.get("./../data/housekeeping/roster/hskpjobrolelist.json")
            .then( (res) => resolve(res.data) )
            .catch( (err) => reject(err) )
        })
    },
    clearallrosters(data) {
        return new Promise((resolve, reject) => {
            Http.post(baseUrl + 'frontend/guestservice/clearallrosters', data)
            // Http.get("./../data/housekeeping/roster/clearallrosters.json")
            .then( (res) => resolve(res.data) )
            .catch( (err) => reject(err) )
        })
    },
    newhskpdevicelist(data) {
        return new Promise((resolve, reject) => {
            Http.post(baseUrl + 'frontend/guestservice/newhskpdevicelist', data)
            // Http.get("./../data/housekeeping/roster/newhskpdevicelist.json")
            .then( (res) => resolve(res.data) )
            .catch( (err) => reject(err) )
        })
    },
}
export default rosterService;