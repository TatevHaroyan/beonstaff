import {COMPANY_SERVICE} from "../action/type";
const serviceState=[]
export default (state=serviceState, action)=>{
    if(action.type===COMPANY_SERVICE){
        return action.payload?action.payload:[];;
    }
    return state
}