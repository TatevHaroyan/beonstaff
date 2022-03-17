import { GET_TASKS } from "../action/type";
export default (state = [], action) => {
    switch (action.type) {
        case GET_TASKS:
            state = action.payload?action.payload.results:[]
            return state
        default:
    }
    return state
}