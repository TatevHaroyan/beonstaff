import { GET_SEE_NOTIFICATION } from "../action/type";
export default (state = {}, action) => {
    switch (action.type) {
        case GET_SEE_NOTIFICATION:
           state=action.payload
            return state
        default:
    }
    return state
}