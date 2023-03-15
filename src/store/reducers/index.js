import {combineReducers} from 'redux'
import {AuthReducer} from './Auth'
import persistStore from './persistStore'

const RootReducer = combineReducers({AuthReducer,persistStore});

export default RootReducer;