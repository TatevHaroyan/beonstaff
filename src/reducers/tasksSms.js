import { GET_TASK_SMS, NEW_TASK_SMS, CLEAN_TASKSMS } from "../action/type";
export default (state = [], action) => {
    switch (action.type) {
        case GET_TASK_SMS:
            state = [...state, ...action.payload]
            return state
        case NEW_TASK_SMS:
            state = action.payload
            return state
        case CLEAN_TASKSMS:
            state=[]
            return state
    }
    return state
}