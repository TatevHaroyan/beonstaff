import { GET_ORG_LIST, LOADING_ORG, ACTIVEPAGE_ORG } from "../action/type";
export default (state = {}, action) => {
    switch (action.type) {
        case ACTIVEPAGE_ORG:
            return {
                ...state,
                activePage: action.payload,
                loader: true
            }
        case LOADING_ORG:
            return {
                ...state,
                loader: true,
                filter: action.payload ? action.payload : {}
            }
        case GET_ORG_LIST:
            state = {
                ...state,
                results: action.payload.results ? action.payload.results : state.results,
                count: action.payload.count ? action.payload.count : state.count,
                loader: false,
                deleted_company_count: action.payload.deleted_company_count ? action.payload.deleted_company_count : state.deleted_company_count
            }
            return state
        default:
    }
    return state
}