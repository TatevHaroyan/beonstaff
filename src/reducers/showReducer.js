import {SHOW} from "../action/type"

export default (state=false, action)=>{
    if(action.type===SHOW){
    state=!state
    }
    return state;
}