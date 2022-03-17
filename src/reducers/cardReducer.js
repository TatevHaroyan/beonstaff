import {GET_CARD} from "../action/type";
const cardState={}
export default (state=cardState, action)=>{
    if(action.type===GET_CARD){
        return action.payload?action.payload:{};
    }
    return state
}