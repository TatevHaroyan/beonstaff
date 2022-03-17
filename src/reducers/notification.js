import { GET_NOTIFICATION } from "../action/type";
export default (state = {}, action) => {
    switch (action.type) {
        case GET_NOTIFICATION:
            // let task = action.payload.results
            // let count = action.payload.count
            state=action.payload
            return state
        default:
    }
    return state
}