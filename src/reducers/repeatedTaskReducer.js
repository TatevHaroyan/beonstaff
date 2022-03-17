import { GET_REPEATED_TASKS, LOADER_FILTER } from "../action/type";
export default (state = { task: [], count: 0, loader_task: false, filter: {} }, action) => {
    switch (action.type) {
        case LOADER_FILTER:
            return {
                ...state,
                loader_task:true,
                filter:action.payload
            }
        case GET_REPEATED_TASKS:
            let task = action.payload ? action.payload.results : []
            let count = action.payload ? action.payload.count : 0
            return {
                ...state,
                task,
                count,
                loader_task:false
            }
        default:
    }
    return state
}