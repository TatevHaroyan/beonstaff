import { GET_COMPANY_FILE, LOADER_COMPANY_FILE } from "../action/type";
const cardState = { 
    results:[],
    count: 0, 
    loader_file: false, 
    filter: {},
 }
export default (state = cardState, action) => {
    if (action.type === GET_COMPANY_FILE) {
        let data = { ...state, ...action.payload, loader_file: false, };
        return data;
    }
    if (action.type === LOADER_COMPANY_FILE) {
        return {
            ...state,
            loader_file: true,
            filter: action.payload
        }
    }
    return state
}