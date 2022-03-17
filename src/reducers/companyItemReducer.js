import {TAXATION_SYSTEM, TYPEACTIVITY} from "../action/type"
const  typeActivity =  (state=[], action)=>{
    if(action.type===TYPEACTIVITY){
    state=action.payload
}
    return state;
}
const taxationSystem=  (state=[], action)=>{
    if(action.type===TAXATION_SYSTEM ){
    state=action.payload
    }
    return state;
}
export {typeActivity,taxationSystem}