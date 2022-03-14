import { combineReducers } from '@reduxjs/toolkit'
import userReducer from './user'
import mapReducer from './map'

export default combineReducers({
  user: userReducer,
  map: mapReducer,
})