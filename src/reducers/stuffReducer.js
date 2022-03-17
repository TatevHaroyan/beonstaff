import { GET_STUFF, LOADING } from "../action/type";
export default (state = {}, action) => {
    switch (action.type) {
        // case ACTIVEPAGE:
        //     return {
        //         ...state,
        //         activePage: action.payload,
        //         loader: true
        //     }
        case LOADING:            
            return {
                ...state,
                loader: true
            }
        case GET_STUFF:
            state = {
                ...state,
                results: action.payload.results,
                count: action.payload.count,
                loader:false
            }
            return state
        default:
    }
    return state
}
