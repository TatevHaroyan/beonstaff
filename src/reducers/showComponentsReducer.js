import { NAVBAR_SHOW} from "../action/type"
const showNavbar =  (state=false, action)=>{
    if(action.type===NAVBAR_SHOW){
    state=!state
}
    return state;
}
export {
     showNavbar,
    };