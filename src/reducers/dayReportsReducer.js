import { SET_DAY_REPORTS } from "../action/type";
export default (state = {}, action) => {
    switch (action.type) {
        case SET_DAY_REPORTS:
            let new_state = action.payload
            return { ...state, ...new_state }
        default:
    }
    return state;
}