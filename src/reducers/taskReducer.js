import { TASK_DATA, DELETE_TASK_DATA } from "../action/type";
export default (state = { end_date: new Date() }, action) => {
    switch (action.type) {
        case TASK_DATA:
            state = {...state,  ...action.payload}
            // action.payload ? action.payload : {}
            return state
        case DELETE_TASK_DATA:
            state = {}
            return state
        default:
    }
    return state
}