
export default (state = {}, action) => {
    switch (action.type) {
        case "EMPLOYEE_DATA":
            state = action.payload
            return state
        default:
    }
    return state
}
