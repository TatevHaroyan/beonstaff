import { GET_ORG } from "../action/type";
export default (state = {}, action) => {
    switch (action.type) {
        case GET_ORG:
            state = {
                ...state,
                results: action.payload,
                // .results,
                // count: action.payload.count,
                loader:false
            }
            return state
        default:
    }
    return state
}
