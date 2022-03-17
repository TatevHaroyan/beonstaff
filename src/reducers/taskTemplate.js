import { GET_TASKS_TEMPLATE } from "../action/type";
export default (state = [], action) => {
    switch (action.type) {
        case GET_TASKS_TEMPLATE:
            state = action.payload ? action.payload.results : []
            return state
        default:
    }
    return state
}