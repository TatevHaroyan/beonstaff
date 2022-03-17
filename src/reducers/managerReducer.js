import { GET_MANAGER } from "../action/type";
export default (state = {
    loader:true,
    array_manager: [],
    multi_manager: []
}, action) => {
    switch (action.type) {
        case GET_MANAGER:
            let multiSelect = []
            for (let i = 0; i < action.payload.results.length; i++) {
                multiSelect.push({ label: `${action.payload.results[i].user.first_name} ${action.payload.results[i].user.last_name}`, value: action.payload.results[i].id })
            }
            let new_state = {
                ...state,
                array_manager: action.payload ? action.payload : [],
                multi_manager: multiSelect,
                loader:false
            }
            return new_state
        default:
    }
    return state
}