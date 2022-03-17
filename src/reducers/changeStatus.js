import {CHANGE_STATUS} from "../action/type";
export default (state = false, action) => {
    switch (action.type) {
        case CHANGE_STATUS:
           state=!state
           return state
           default: 
    }
    return state
}