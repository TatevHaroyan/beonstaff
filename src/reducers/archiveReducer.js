import { GET_ARCHIVE } from "../action/type";
export default (state = [], action) => {
    switch (action.type) {
        case GET_ARCHIVE:
            state = action.payload.results
            return state
        default:
    }
    return state
}