import { GET_EMPLOYEE_DATA, DELETE_EMPLOYEE_DATA } from "../action/type";
export default (state = {}, action) => {
    switch (action.type) {
        case GET_EMPLOYEE_DATA:
            state = action.payload
            return state
            case DELETE_EMPLOYEE_DATA:
                state = {}
                return state
            default:
    }
    return state
}