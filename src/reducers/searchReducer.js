import {SEARCH, DELETE_SEARCH} from "../action/type";

export default (state="",action)=>{
  if(action.type===SEARCH) {
    state=action.payload
    return state
  }
  if(action.type===DELETE_SEARCH){
    state=""
  }
  return state
}