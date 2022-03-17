import { GET_ORG_LIMIT, GET_STUFF_LIMIT, LAODER_ORG, LOADER_STUFF } from "../action/type";
export default (state = { orgs: [], loader_orgs: false, stuff: [], loader_stuff: false }, action) => {
    switch (action.type) {
        case LAODER_ORG:
            return {
                ...state,
                loader_orgs: true
            }
        case LOADER_STUFF:
            return {
                ...state,
                loader_stuff: true
            }
        case GET_ORG_LIMIT:
            let company = action.payload ? action.payload : []
            let multiSelect = [
                // { 
                //  label: "Ընտրել բոլորը",
                //   value: "*"}
            ] 
            for (let i = 0; i < company.length; i++) {
                multiSelect.push({ label: company[i].name, value: company[i].id })
            }
            return {
                ...state,
                orgs: multiSelect,
                loader_orgs: false
            }
        case GET_STUFF_LIMIT:
            let list = action.payload.stuff ? action.payload.stuff : action.payload.manager
            // let manager = action.payload.manager?action.payload.manager:[]
            let multiSelectList = [
                // { 
                // label: "Ընտրել բոլորը",
                //  value: "*"}
            ]
            for (let i = 0; i < list.length; i++) {
                multiSelectList.push({ label: list[i].user.first_name + " " + list[i].user.last_name, value: list[i].id })
            }
            return {
                ...state,
                stuff: multiSelectList,
                loader_stuff: false
            }
        default:
    }
    return state
}