// const SERVER = "http://192.168.1.128:8000/api/"
import * as queryString from "../utils/query-string";
import { SERVER } from "../config";
// const SERVER = "https://admin.beon.am/api/" //server petq e mna
const needLogin = () => {    //petq e
    localStorage.clear();
    if (window.location.pathname !== "/" && window.location.pathname !== "/main_employee") {
        window.location = "/"
    }
}
const errorMessage = (message) => {
    this.message = message;
}
// const updateMyToken = (token) => {
//     let refreshToken = localStorage.getItem("refreshToken")
//     return fetch(SERVER + "/employee/refresh/token", {
//         method: "GET",
//         headers: {
//             token: token,
//             refresh_token: refreshToken
//         }
//     }).then(res => {
//         return res.json()
//     }).then(res => {
//         return res
//     })
// }
const changeExistingPassword = (data) => {
    return fetch(SERVER + "change-existing-password/", {
        method: 'PUT',
        headers: {
            "content-type": "application/json",
        },
        body: JSON.stringify(data)
    })
        .then(res => {
            if (res.status === 200 || res.status === 201)
                return res.json()
            return { error: true }
        }).then((responce) => responce)
        .catch((error) => console.log(error)
        )
}
const changeEmail = (data) => {
    return fetch(SERVER + "send-email-verification-code/", {
        method: 'POST',
        headers: {
            "content-type": "application/json",
        },
        body: JSON.stringify(data)
    })
        .then(res => {
            if (res.status === 200 || res.status === 201)
                return res.json()
            return res.json()
        }).then((responce) => responce)
        .catch((error) => console.log(error)
        )
}
const getStaffType = () => {
    const token = localStorage.getItem("token")
    return fetch(SERVER + "accountant-types/", {
        method: "GET",
        headers: {
            'Authorization': 'Bearer ' + token,
            // token: token
        }
    }).then((res) => {
        if (res.status === 401) {
            needLogin()
        }
        if (res.status === 200 || res.tatus === 201)
            return res.json()
        else {
            throw new errorMessage("error")
        }
    })
        .catch((error) => console.log(error, "manager error")
        )
}
const checkEmail = (data) => {
    const token = localStorage.getItem("token")
    return fetch(SERVER + "check-email-verification-code/", {
        method: 'POST',
        headers: {
            "content-type": "application/json",
            'Authorization': 'Bearer ' + token,
        },
        body: JSON.stringify(data)
    })
        .then(res => {
            if (res.status === 200 || res.status === 201)
                return res.json()
            return res.json()
        }).then((responce) => responce)
        .catch((error) => console.log(error)
        )
}
const getTaskSms = (id, data) => {
    const token = localStorage.getItem("token")
    return fetch(SERVER + `get-task-smses/${id}/`, {
        method: "POST",
        headers: {
            "content-type": "application/json",
            'Authorization': 'Bearer ' + token,
        },
        body: JSON.stringify(data)
    })
        .then((res) => res.json())
        .then((res) => { return res })
        .catch((e) => {
            console.log(e);
        })

}
const getManager = (token, params) => {
    let query = queryString.stringify(params);
    return fetch(SERVER + `manager/?${query}`, {
        method: "GET",
        headers: {
            'Authorization': 'Bearer ' + token,
            // token: token
        }
    }).then((res) => {
        if (res.status === 401) {
            needLogin()
        }
        if (res.status === 200 || res.tatus === 201)
            return res.json()
        else {
            throw new errorMessage("error")
        }
    })
        .catch((error) => console.log(error, "manager error")
        )
}
const todaysTaskSum = () => {
    let profession = localStorage.getItem("profession");
    let id = localStorage.getItem("id");
    return fetch(SERVER + `todays-task-sum/${id}/${profession}`, {
        method: "GET",
        // headers: {
        //     'Authorization': 'Bearer ' + token,
        //     // token: token
        // }
    }).then((res) => {
        if (res.status === 401) {
            needLogin()
        }
        if (res.status === 200 || res.tatus === 201)
            return res.json()
        return { error: true }
    })
        .catch((error) => console.log(error, "manager error")
        )
}
const getReport = (id, start, end, title) => {
    // report/3/2021-1-1/2021-4-26/template/json/
    return fetch(SERVER + `report/${id}/${start}/${end}/${title}/json/`, {
        method: "GET",
        // headers: {
        //     'Authorization': 'Bearer ' + token,
        //     // token: token
        // }
    }).then((res) => {
        if (res.status === 401) {
            needLogin()
        }
        if (res.status === 200 || res.tatus === 201)
            return res.json()
        return { error: true }
    })
        .catch((error) => console.log(error, "manager error")
        )
}
// const getManagerReport = (id, start, end) => {
//     // let token = localStorage.getItem("token");
//     return fetch(SERVER + `show-worker-info-manager/${id}/${start}/${end}`, {
//         method: "GET",
//         // headers: {
//         //     'Authorization': 'Bearer ' + token,
//         //     // token: token
//         // }
//     }).then((res) => {
//         if (res.status === 401) {
//             needLogin()
//         }
//         if (res.status === 200 || res.tatus === 201)
//             return res.json()
//         return { error: true }
//     })
//         .catch((error) => console.log(error, "manager error")
//         )
// }
const getTaskTemplate = (token) => {
    console.log("in getTaskTemplate");
    return fetch(SERVER + "task-template/?limit=1000", {
        method: "GET",
        headers: {
            'Authorization': 'Bearer ' + token,
            // token: token
        }
    }).then((res) => {
        if (res.status === 401) {
            needLogin()
        }
        if (res.status === 200 || res.tatus === 201)
            return res.json()
        else {
            throw new errorMessage("error")
        }
    })
        .catch((error) => console.log(error, "manager error")
        )
}
const getClient = (params) => {
    let token = localStorage.getItem("token");
    let query = params ? queryString.stringify(params) : "";
    return fetch(SERVER + `client/?${query}`, {
        method: "GET",
        headers: {
            'Authorization': 'Bearer ' + token,
            // token: token
        }
    }).then((res) => {
        if (res.status === 401) {
            needLogin()
        }
        if (res.status === 200 || res.tatus === 201)
            return res.json()
        else {
            throw new errorMessage("error")
        }
    })
        .catch((error) => console.log(error, "client error"))
}
const get_deleted_companies_count = () => {
    const token = localStorage.getItem("token")
    return fetch(SERVER + 'get-deleted-companies-count/', {
        method: "GET",
        headers: {
            'Authorization': 'Bearer ' + token,
        }
    })
        .then((res) => {
            if (res.status === 401) {
                needLogin()
            }
            if (res.status === 200 || res.tatus === 201)
                return res.json()
            else {
                throw new errorMessage("error")
            }
        })
}
const companyService = () => {
    const token = localStorage.getItem("token")
    return fetch(SERVER + 'company-service/', {
        method: "GET",
        headers: {
            'Authorization': 'Bearer ' + token,
        }
    })
        .then((res) => {
            if (res.status == 401) {
                needLogin()
            }
            if (res.status === 200 || res.status === 201) {
                return res.json()
            }
            else {
                return { error: "course error" }
            }
        }
        )
        .catch((error) => console.log(error)
        )
}
const getNoteNextPage = (token, id, page) => {
    return fetch(SERVER + `accountant-note/?accountant=${id}&offset=${!page ? "" : page * 10}`, {
        method: "GET",
        headers: {
            'Authorization': 'Bearer ' + token,
            // token: token
        }
    }).then((res) => {
        if (res.status === 401) {
            needLogin()
        }
        if (res.status === 200 || res.tatus === 201)
            return res.json()
        else {
            throw new errorMessage("error")
        }
    })
        .catch((error) => console.log(error, " error"))
}
// const getNotifiacationextPage = (token, id, page) => {
//     return fetch(SERVER + `manager-notification/?accountant=${id}&offset=${!page ? "" : page * 10}`, {
//         method: "GET",
//         headers: {
//             'Authorization': 'Bearer ' + token,
//             // token: token
//         }
//     }).then((res) => {
//         if (res.status === 401) {
//             needLogin()
//         }
//         if (res.status === 200 || res.tatus === 201)
//             return res.json()
//         else {
//             throw new errorMessage("error")
//         }
//     })
//         .catch((error) => console.log(error, " error"))
// }
const delete_company = (data) => {
    return fetch(SERVER + "manager/set/deleted/company", {
        method: 'POST',
        headers: {
            "content-type": "application/json"
        },
        body: JSON.stringify(data)
    })
        .then(res => {
            if (res.status === 401) {
                needLogin()
            }
            if (res.status === 200 || res.status === 201)
                return res.json()
            return { error: true }
        })
        .catch((error) => console.log(error))
}
const getAccountantNextPage = (token, page) => {
    return fetch(SERVER + `accountant/?offset=${page ? page * 10 : ""}`, {
        method: "GET",
        headers: {
            'Authorization': 'Bearer ' + token,
            // token: token
        }
    }).then((response) => {
        if (response.status === 401) {
            needLogin()
        }
        if (response.status === 200 || response.tatus === 201)
            return response.json()
        else {
            throw new errorMessage("error")
        }
    })
        .catch((error) => console.log(error, " error"))
}
const getManagerNextPage = (token, page) => {
    return fetch(SERVER + `manager/?offset=${page ? page * 10 : ""}`, {
        method: "GET",
        headers: {
            'Authorization': 'Bearer ' + token,
            // token: token
        }
    }).then((res) => {
        if (res.status === 401) {
            needLogin()
        }
        if (res.status === 200 || res.tatus === 201)
            return res.json()
        else {
            throw new errorMessage("error")
        }
    })
        .catch((error) => console.log(error, " error"))
}
const login_post = (inputData, prof) => {
    return fetch(SERVER + `login/${prof}`, {
        method: 'POST',
        headers: {
            "content-type": "application/json"
        },
        body: JSON.stringify(inputData)
    })
        .then(res => {
            if (res.status === 200 || res.status === 201)
                return res.json()
            return { error: true }
        })
        .catch((error) => console.log(error))
}
const getMe = (token, prof) => {

    return fetch(SERVER + `${prof}/me`, {
        method: "GET",
        headers: {
            'Authorization': 'Bearer ' + token,
        }
    }).then((res) => {
        if (res.status === 401) {
            needLogin()
        }
        if (res.status === 200 || res.tatus === 201)
            return res.json()
        else {
            throw new errorMessage("error")
        }
    })
        .catch((error) => console.log(error))
}

const getMeById = (id, token, profession) => {
    return fetch(SERVER + `${profession}/${id}/`, {
        method: "GET",
        headers: {
            'Authorization': 'Bearer ' + token,
        }
    })
        .then((res) => {
            if (res.status === 401) {
                needLogin()
            }
            if (res.status === 200 || res.tatus === 201)
                return res.json()
            else {
                throw new errorMessage("error")
            }
        })
        .then((data) => {
            return data
        })
        .catch((error) => console.log(error))
}
const changeMyData = (data, id) => {
    const token = localStorage.getItem("token");
    const profession = localStorage.getItem("profession");
    return fetch(SERVER + `${profession}/${id}/`, {
        method: "PUT",
        headers: {
            'Authorization': 'Bearer ' + token,
        },
        body: data
    })
        .then((res) => {
            if (res.status === 401) {
                needLogin()
            }
            if (res.status === 200 || res.tatus === 201)
                return res.json()
            return { error: true }
        })
        .catch((error) => console.log(error))
}
const changeEmployeeData = (data, token, id, proff) => {
    return fetch(SERVER + `${proff}/${id}/`, {
        method: "PUT",
        headers: {
            'Authorization': 'Bearer ' + token,
        },
        body: data
    })
        .then((res) => {
            if (res.status === 401) {
                needLogin()
            }
            if (res.status === 200 || res.tatus === 201)
                return res.json()
            else {
                throw new errorMessage("error")
            }
        })
        .catch((error) => console.log(error))
}
const getEmployeeData = (id, token, str) => {
    return fetch(SERVER + `${str}/${id}/`, {
        method: "GET",
        headers: {
            'Authorization': 'Bearer ' + token,
        }
    })
        .then((res) => {
            if (res.status === 401) {
                needLogin()
            }
            if (res.status === 200 || res.tatus === 201)
                return res.json()
            else {
                throw new errorMessage("error")
            }
        })
        .then((data) => {
            return data
        })
        .catch((error) => console.log(error))
}
const getMyTasks = (id, token, prof) => {
    return fetch(SERVER + `client-task/?${prof}=${id}`, {
        method: "GET",
        headers: {
            'Authorization': 'Bearer ' + token,
        }
    })
        .then((res) => {
            if (res.status === 401) {
                needLogin()
            }
            if (res.status === 200 || res.tatus === 201)
                return res.json()
            else {
                throw new errorMessage("error")
            }
        })
        .then((data) => {
            return data
        })
        .catch((error) => console.log(error))
}
const getMyRepeatedTasks = (params) => {
    const query = queryString.stringify(params)
    const token = localStorage.getItem("token");
    return fetch(SERVER + `repeated-task/?${query}`
        , {
            method: "GET",
            headers: {
                'Authorization': 'Bearer ' + token,
            }
        })
        .then((res) => {
            if (res.status === 401) {
                needLogin()
            }
            if (res.status === 200 || res.tatus === 201)
                return res.json()
            else {
                throw new errorMessage("error")
            }
        })
        .then((data) => {
            return data
        })
        .catch((error) => console.log(error))
}
const clientRate = (data) => {
    const token = localStorage.getItem("token");
    return fetch(SERVER + `client-rate/`, {
        method: 'POST',
        headers: {
            "content-type": "application/json",
            'Authorization': 'Bearer ' + token,
        },
        body: JSON.stringify(data)
    })
        .then(res => {
            if (res.status === 401) {
                needLogin()
            }
            if (res.status === 200 || res.status === 201)
                return res.json()
            else {
                throw new errorMessage("error")
            }
        })
}
const changeOrg = (data, token, id) => {
    return fetch(SERVER + `client-company/${id}/`, {
        method: 'PUT',
        headers: {
            'Authorization': 'Bearer ' + token,
        },
        body: data
    })
        .then(res => {
            if (res.status == 401) {
                // needLogin()
            }
            if (res.status === 200 || res.status === 201)
                return res.json()
            return { error: true }
        })
        .catch((error) => console.log(error))
}
const getCompanyData = (token, id) => {
    return fetch(SERVER + `manager-company/${id}/`, {
        method: "GET",
        headers: {
            'Authorization': 'Bearer ' + token,
        }
    }).then((response) => {
        if (response.status == 401) {
            needLogin()
        }
        if (response.status === 200 || response.status === 201)
            return response.json()
        else {
            throw { error: true }
        }
    })
        .catch((error) => console.log(error))
}
// const getClientTaskNextPage = (token, page, status, prof, id, start_date, end_date, accountantList, companyList, archive) => {
//     console.log(accountantList, "accountantList");
//     console.log(companyList, "companyList");
//     let strCompany = '';
//     let straccountant = ''
//     if (accountantList.length > 0) {
//         if (accountantList.length === 1) {
//             straccountant = `${accountantList[0].value}`
//         } else {
//             straccountant = `${accountantList[0].value}`
//             for (let i = 1; i < accountantList.length; i++) {
//                 straccountant += `,${accountantList[i].value}`
//             }
//         }
//     }
//     if (companyList.length > 0) {
//         if (companyList.length === 1) {
//             strCompany = `${companyList[0].value}`
//         } else {
//             strCompany = `${companyList[0].value}`
//             for (let i = 1; i < companyList.length; i++) {
//                 strCompany += `,${companyList[i].value}`
//             }
//         }
//     }
//     return fetch(SERVER + `client-task/?${prof}=${id}&offset=${page ? page : ""}&start_date=${start_date}&end_date=${end_date}&status=${status}&is_archive=${archive}&accountant=${straccountant}&company=${strCompany}`, {
//         method: "GET",
//         headers: {
//             'Authorization': 'Bearer ' + token,
//         }
//     }).then((res) => {
//         if (res.status === 401) {
//             needLogin()
//         }
//         if (res.status === 200 || res.tatus === 201) {
//             return res.json()
//         }
//         else {
//             throw new errorMessage("error")
//         }
//     })
//         .catch((error) => console.log(error))
// }
const getTaskByFilter = (token, status, start_date, end_date, accountantId, companyId, is_archive) => {
    return fetch(SERVER + `client-task/?manager=&status=${status}&start_date=${start_date}&end_date=${end_date}&is_archive=${is_archive}&company=${companyId}&accountant${accountantId}`, {
        method: "GET",
        headers: {
            'Authorization': 'Bearer ' + token,
        }
    })
        .then((res) => {
            if (res.status === 401) {
                needLogin()
            }
            if (res.status === 200 || res.tatus === 201)
                return res.json()
            else {
                throw new errorMessage("error")
            }
        })
        .then((data) => {
            return data
        })
        .catch((error) => console.log(error))
}
const getTaskByFilters = (params) => {
    let query = queryString.stringify(params);
    const token = localStorage.getItem("token");
    const add_accountant_empty = params.accountant === "" && params.manager ? query += "&accountant=" : query;
    const add_accountant_null = params.accountant === null && params.manager ? query += "&accountant_null=true" : add_accountant_empty;
    return fetch(SERVER + `client-task/?${add_accountant_null}`, {
        method: "GET",
        headers: {
            'Authorization': 'Bearer ' + token,
        }
    })
        .then((res) => {
            if (res.status === 401) {
                needLogin()
            }
            if (res.status === 200 || res.tatus === 201)
                return res.json()
            else {
                throw new errorMessage("error")
            }
        })
        .then((data) => {
            return data
        })
        .catch((error) => console.log(error))
}
const getOrgData = (token, id) => {
    return fetch(SERVER + `manager-company/${id}/`, {
        method: "GET",
        headers: {
            'Authorization': 'Bearer ' + token,
        }
    })
        .then((res) => {
            if (res.status === 401) {
                needLogin()
            }
            if (res.status === 200 || res.tatus === 201)
                return res.json()
            else {
                throw new errorMessage("error")
            }
        })
        .then((data) => {
            return data
        })
        .catch((error) => console.log(error))
}
// const getAccountantTasks = (status, token, prof, id, start_date, end_date, company, is_archive) => {
//     let strCompany = '';
//     if (typeof company !== "object" && company !== "") {
//         strCompany += `company=${company}`
//     } else {
//         for (let i = 0; i < (company ? company.length : [].length); i++) {
//             strCompany += `company=${company[i].value}&`
//         }
//     }
//     return fetch(SERVER + `client-task/?${prof}=${id}&status=${status}&is_archive=${is_archive}&start_date=${start_date}&end_date=${end_date}&${strCompany}`, {
//         method: "GET",
//         headers: {
//             'Authorization': 'Bearer ' + token,
//         }
//     })
//         .then((res) => {
//             if (res.status === 401) {
//                 needLogin()
//             }
//             if (res.status === 200 || res.tatus === 201)
//                 return res.json()
//             else {
//                 throw new errorMessage("error")
//             }
//         })
//         .then((data) => {
//             return data
//         })
//         .catch((error) => console.log(error))
// }
const taskSms = (id, token, formData) => {
    return fetch(SERVER + `client-task-sms/`, {
        method: 'POST',
        headers: {
            'Authorization': 'Bearer ' + token,
        },
        body: formData
    })
        .then(res => {
            if (res.status === 401) {
                needLogin()
            }
            if (res.status === 200 || res.status === 201)
                return res.json()
            else {
                throw new errorMessage("error")
            }
        })
}
const getTasks = (token) => {
    return fetch(SERVER + "client-task/", {
        method: "GET",
        headers: {
            'Authorization': 'Bearer ' + token,
        }
    })
        .then((res) => {
            if (res.status === 401) {
                needLogin()
            }
            if (res.status === 200 || res.tatus === 201)
                return res.json()
            else {
                throw new errorMessage("error")
            }
        })
        .then((data) => {
            return data
        })
}
const getNote = (token, id) => {
    return fetch(SERVER + `accountant-note/?accountant=${id}`, {
        method: "GET",
        headers: {
            'Authorization': 'Bearer ' + token,
        }
    })
        .then((res) => {
            if (res.status === 401) {
                needLogin()
            }
            if (res.status === 200 || res.tatus === 201)
                return res.json()
        })
        .catch((error) => {
            console.log(error)
        })
}
const getNotification = (params) => {
    const query = queryString.stringify(params)
    const token = localStorage.getItem("token")
    return fetch(SERVER + `manager-notification/?${query}`, {
        method: "GET",
        headers: {
            'Authorization': 'Bearer ' + token,
        }
    })
        .then((res) => {
            if (res.status === 401) {
                needLogin()
            }
            if (res.status === 200 || res.status === 201)
                return res.json()
        })
        .catch((error) => {
            console.log(error)
        })
}
const sendArchive = (id, token) => {
    return fetch(SERVER + `manager/set/archive`, {
        method: 'POST',
        headers: {
            "content-type": "application/json",
            'Authorization': 'Bearer ' + token,
        },
        body: JSON.stringify({
            "status": true,
            "id": id
        })
    })
        .then(res => {
            if (res.status === 401) {
                needLogin()
            }
            if (res.status === 200 || res.status === 201)
                return res.json()
            else {
                throw new errorMessage("error")
            }
        })
}
const getAccountantCompany = (id, token, prof, limit) => {
    return fetch(SERVER + `client-company/?${prof}=${id}&limit=${limit}`, {
        method: "GET",
        headers: {
            'Authorization': 'Bearer ' + token,
        }
    })
        .then((res) => {
            if (res.status === 401) {
                needLogin()
            }
            if (res.status === 200 || res.tatus === 201)
                return res.json()
            else {
                throw new errorMessage("error")
            }
        })
        .then((data) => {
            return data
        })
}
const AddAccountantCompany = (id, token, data) => {
    return fetch(SERVER + `client-company/${id}/`, {
        method: "PUT",
        headers: {
            "content-type": "application/json",
            'Authorization': 'Bearer ' + token
        },
        body: JSON.stringify(data)
    })
        .then((res) => {
            if (res.status === 401) {
                needLogin()
            }
            if (res.status === 200 || res.tatus === 201)
                return res.json()
            else {
                throw new errorMessage("error")
            }
        })
        .then((data) => {
            return data
        })
}

const getOrg = (params, limit) => {
    let token = localStorage.getItem("token");
    let query = queryString.stringify(params);
    // limit=${limit ? limit : ""}
    return fetch(SERVER + `manager-company/?${query}`, {
        method: "GET",
        headers: {
            'Authorization': 'Bearer ' + token,
        }
    })
        .then((res) => {
            if (res.status === 401) {
                needLogin()
            }
            if (res.status === 200 || res.tatus === 201)
                return res.json()
            else {
                throw new errorMessage("error")
            }
        })
        .then((data) => {
            return data
        })
}
// const getOrgbyName = (token, name) => {
//     return fetch(SERVER + `manager-company/?name=${name}`, {
//         method: "GET",
//         headers: {
//             'Authorization': 'Bearer ' + token,
//         }
//     })
//         .then((res) => {
//             if (res.status === 401) {
//                 needLogin()
//             }
//             if (res.status === 200 || res.tatus === 201)
//                 return res.json()
//             else {
//                 throw new errorMessage("error")
//             }
//         })
//         .then((data) => {
//             return data
//         })
// }

const getStuff = (token, params) => {
    let query = queryString.stringify(params);
    return fetch(SERVER + `accountant/?${query}`, {
        method: "GET",
        headers: {
            'Authorization': 'Bearer ' + token,
        }
    })
        .then((res) => {
            if (res.status === 401) {
                needLogin()
            }
            if (res.status === 200 || res.tatus === 201)
                return res.json()
            else {
                throw new errorMessage("error")
            }
        })
        .then((data) => {
            return data
        })
}
const newStuff = (token, data) => {
    return fetch(SERVER + "accountant/", {
        method: "POST",
        headers: {
            'Authorization': 'Bearer ' + token,
        },
        body: data
    })
        .then((res) => {
            if (res.status === 401) {
                needLogin()
            }
            if (res.status === 200 || res.status === 201)
                return res.json()
            return { error: true }
        })
        .catch((error) => console.log(error))
}
const newFile = (token, data) => {
    return fetch(SERVER + "client-task-file/", {
        method: "POST",
        headers: {
            'Authorization': 'Bearer ' + token,
        },
        body: data
    })
        .then((res) => {
            if (res.status === 401) {
                needLogin()
            }
            if (res.status === 200 || res.status === 201)
                return res.json()
            return { error: true }
        })
        .catch((error) => console.log(error))
}
const timer = (token, data) => {
    return fetch(SERVER + `client-task-timer/`, {
        method: "POST",
        headers: {
            'Authorization': 'Bearer ' + token,
            "content-type": "application/json"
        },
        body: JSON.stringify(data)
    })
        .then((res) => {
            if (res.status === 401) {
                needLogin()
            }
            if (res.status === 200 || res.status === 201)
                return res.json()
            else {
                throw new errorMessage("error")
            }
        })
        .then((data) => {
            return data
        })
}
const changeTimerById = (token, data, id) => {
    return fetch(SERVER + `client-task-timer/${id}/`, {
        method: "PUT",
        headers: {
            'Authorization': 'Bearer ' + token,
            "content-type": "application/json"
        },
        body: JSON.stringify(data)
    })
        .then((res) => {
            if (res.status === 401) {
                needLogin()
            }
            if (res.status === 200 || res.status === 201)
                return res.json()
            else {
                throw new errorMessage("error")
            }
        })
        .then((data) => {
            return data
        })
}
const addStuff = (token, data, id) => {
    return fetch(SERVER + `client-task/${id}/`, {
        method: "PATCH",
        headers: {
            'Authorization': 'Bearer ' + token,
            "content-type": "application/json"
        },
        body: JSON.stringify(data)
    })
        .then((res) => {
            if (res.status === 401) {
                needLogin()
            }
            if (res.status === 200 || res.status === 201)
                return res.json()
            else {
                throw new errorMessage("error")
                // return {
                //     error: true
                // }
            }
        })
        .then((data) => {
            return data
        })
}
const editStatus = (token, id, start_or_end) => {
    return fetch(SERVER + `${start_or_end}/${id}/`, {
        method: "POST",
        headers: {
            'Authorization': 'Bearer ' + token,
            "content-type": "application/json"
        },
        body: JSON.stringify({ id })
    })
        .then((res) => {
            if (res.status === 401) {
                needLogin()
            }
            if (res.status === 200 || res.status === 201)
                return res.json()
            else {
                throw new errorMessage("error")
            }
        })
        .then((data) => {
            return data
        })
}
const newNote = (token, data) => {
    return fetch(SERVER + "accountant-note/", {
        method: "POST",
        headers: {
            "content-type": "application/json",
            'Authorization': 'Bearer ' + token,
        },
        body: JSON.stringify(data)
    })
        .then((res) => {
            if (res.status === 401) {
                needLogin()
            }
            if (res.status === 200 || res.status === 201) {
                return res.json()
            }
            else {
                return { error: true }
            }
        })
        .then((data) => {
            return data
        })
}
const seenFiles = (token, id) => {
    return fetch(SERVER + `set-task-files-seen/${id}/`, {
        method: "POST",
        headers: {
            "content-type": "application/json",
            'Authorization': 'Bearer ' + token,
        },
        body: {}
    })
        .then((res) => {
            return res
        })
        .catch((e) => {
            console.log(e);
        })

}
const seenSms = (token, id) => {
    return fetch(SERVER + `set-task-smses-seen/${id}/`, {
        method: "POST",
        headers: {
            "content-type": "application/json",
            'Authorization': 'Bearer ' + token,
        },
        body: {}
    })
        .then((res) => {
            return res
        })
        .catch((e) => {
            console.log(e);
        })

}
const newNotification = (token, formData) => {
    return fetch(SERVER + "manager-notification/", {
        method: "POST",
        headers: {
            'Authorization': 'Bearer ' + token,
        },
        body: formData
    })
        .then((res) => {
            if (res.status === 401) {
                needLogin()
            }
            if (res.status === 200 || res.status === 201) {
                return res.json()
            }
            else {
                return { error: true }
            }
        })
        .then((data) => {
            return data
        })

}
const newTask = (
    token, formData
) => {
    formData.append("status", "approved")
    return fetch(SERVER + "multi-task-account", {
        method: 'POST',
        headers: {
            'Authorization': 'Bearer ' + token,
        },
        body: formData
    })
        .then(res => {
            if (res.status === 401) {
                needLogin()
            }
            if (res.status === 200 || res.status === 201)
                return res.json()

            return { error: true }

        })
}
const newTaskByAccountant = (
    token, formData
) => {
    formData.append("status", "approved")
    return fetch(SERVER + "client-task/", {
        method: 'POST',
        headers: {
            'Authorization': 'Bearer ' + token,
        },
        body: formData
    })
        .then(res => {
            if (res.status === 401) {
                needLogin()
            }
            if (res.status === 200 || res.status === 201)
                return res.json()

            return { error: true }

        })
}
const EditTask = (
    token, formData, id
) => {
    // formData.append("status", "approved")
    return fetch(SERVER + `client-task/${id}/`, {
        method: 'PATCH',
        headers: {
            'Authorization': 'Bearer ' + token,
        },
        body: formData
    })
        .then(res => {
            if (res.status === 401) {
                needLogin()
            }
            if (res.status === 403) {
                return { change: false }
            }
            if (res.status === 200 || res.status === 201)
                return res.json()
            return { error: true }

        })
}
const MultiTask = (
    token, formData
) => {
    formData.append("status", "approved")
    return fetch(SERVER + "multi-task/", {
        method: 'POST',
        headers: {
            'Authorization': 'Bearer ' + token,
        },
        body: formData
    })
        .then(res => {
            if (res.status === 401) {
                needLogin()
            }
            if (res.status === 200 || res.status === 201)
                return res.json()
            return { error: true }

        })
}
const newRepeatedTask = (
    token, formData
) => {
    return fetch(SERVER + "repeated-task/", {
        method: 'POST',
        headers: {
            'Authorization': 'Bearer ' + token,
        },
        body: formData
    })
        .then(res => {
            if (res.status === 401) {
                needLogin()
            }
            if (res.status === 200 || res.status === 201)
                return res.json()
            return { error: true }

        })
}
const multiNewRepeatedTask = (
    token, formData
) => {
    return fetch(SERVER + "multi-repeated-task/", {
        method: 'POST',
        headers: {
            'Authorization': 'Bearer ' + token,
        },
        body: formData
    })
        .then(res => {
            if (res.status === 401) {
                needLogin()
            }
            if (res.status === 200 || res.status === 201)
                return res.json()
            return { error: true }

        })
}
const ChangeRepeatedTask = (
    token, formData, id
) => {
    return fetch(SERVER + `repeated-task/${id}/`, {
        method: 'PUT',
        headers: {
            'Authorization': 'Bearer ' + token,
        },
        body: formData
    })
        .then(res => {
            if (res.status === 401) {
                needLogin()
            }
            if (res.status === 200 || res.status === 201)
                return res.json()
            return { error: true }

        })
}
const getTaskById = (token, id) => {
    return fetch(SERVER + `client-task/${id}/`, {
        method: "GET",
        headers: {
            'Authorization': 'Bearer ' + token,
        }
    })
        .then((res) => {
            if (res.status === 401) {
                needLogin()
            }
            if (res.status === 200 || res.tatus === 201)
                return res.json()
            else {
                throw new errorMessage("error")
            }
        })
        .then((data) => {
            return data
        })
}
const getTaskSmsesOnlyFile = (token, id) => {
    return fetch(SERVER + `get-task-smses-only-file/${id}/`, {
        method: "POST",
        headers: {
            "content-type": "application/json",
            'Authorization': 'Bearer ' + token,
        },
        body: JSON.stringify({
            "for_all": null
        })
    })
        .then((res) => {
            if (res.status === 401) {
                needLogin()
            }
            if (res.status === 200 || res.tatus === 201)
                return res.json()
            else {
                throw new errorMessage("error")
            }
        })
        .then((data) => {
            return data
        })
}
const putNotificationById = (token, id, data) => {
    return fetch(SERVER + `manager-notification/${id}/`, {
        method: "PUT",
        headers: {
            "content-type": "application/json",
            'Authorization': 'Bearer ' + token,
        },
        body: JSON.stringify(data)
    })
        .then((res) => {
            if (res.status === 401) {
                needLogin()
            }
            if (res.status === 200 || res.tatus === 201)
                return res.json()
            else {
                throw new errorMessage("error")
            }
        })
        .catch((error) => console.log(error))
}
const getNotificationById = (token, id) => {
    return fetch(SERVER + `manager-notification/${id}/`, {
        method: "GET",
        headers: {
            'Authorization': 'Bearer ' + token,
        }
    })
        .then((res) => {
            if (res.status === 401) {
                needLogin()
            }
            if (res.status === 200 || res.tatus === 201)
                return res.json()
            else {
                throw new errorMessage("error")
            }
        })
        .then((data) => {
            return data
        })
}
const getRepeadTaskById = (token, id) => {
    return fetch(SERVER + `repeated-task/${id}/`, {
        method: "GET",
        headers: {
            'Authorization': 'Bearer ' + token,
        }
    })
        .then((res) => {
            if (res.status === 401) {
                needLogin()
            }
            if (res.status === 200 || res.tatus === 201)
                return res.json()
            else {
                throw new errorMessage("error")
            }
        })
        .then((data) => {
            return data
        })
}
const getClientByTd = (token, id) => {
    return fetch(SERVER + `client/${id}/`, {
        method: "GET",
        headers: {
            'Authorization': 'Bearer ' + token,
        }
    })
        .then((res) => {
            if (res.status === 401) {
                needLogin()
            }
            if (res.status === 200 || res.tatus === 201)
                return res.json()
            else {
                throw new errorMessage("error")
            }
        })
        .then((data) => {
            return data
        })
}

const getSocial = (token) => {
    return fetch(SERVER + 'social/', {
        method: "GET",
        headers: {
            'Authorization': 'Bearer ' + token,
        }
    })
        .then((res) => {
            if (res.status === 401) {
                needLogin()
            }
            if (res.status === 200 || res.tatus === 201)
                return res.json()
            else {
                throw new errorMessage("error")
            }
        })
        .then((data) => {
            return data
        })
}
const deleteNote = (id) => {
    return fetch(SERVER + `accountant-note/${id}/`, {
        method: "DELETE"
    })
        .then(res => {
            return res
        })
        .catch(err => console.error(err))
}
const deleteNotification = (id) => {
    return fetch(SERVER + `manager-notification/${id}/`, {
        method: "DELETE"
    })
        .then(res => {
            return res
        })
        .catch(err => console.error(err))
}
const deleteArchive = (id) => {
    return fetch(SERVER + `client-task/${id}/`, {
        method: "DELETE"
    })
        .then(res => {
            return res
        })
        .catch(err => console.error(err))
}
const deleteRepeatedTask = (id) => {
    const token = localStorage.getItem("token")
    return fetch(SERVER + `repeated-task/${id}/`, {
        method: "DELETE",
        headers: {
            'Authorization': 'Bearer ' + token,
        }
    })
        .then(res => {
            return res
        })
        .catch(err => console.error(err))
}
const deleteFileCompany = (url) => {
    return fetch(url, {
        method: "DELETE"
    })
        .then(res => {
            return res
        })
        .catch(err => console.error(err))
}
const deletenotification = (id) => {
    return fetch(SERVER + `manager-notification/${id}/`, {
        method: "DELETE"
    })
        .then(res => {
            return res
        })
        .catch(err => console.error(err))
}
const deleteFile = (url) => {
    const token = localStorage.getItem("token")
    return fetch(url, {
        method: "DELETE",
        headers: {
            'Authorization': 'Bearer ' + token,
        }
    })
        .then(res => {
            if (res.status === 204)
                return { error: false }
            else {
                return { error: true }
            }
        })
        .catch(err => console.error(err))
}
const typeActivity = (token) => {
    return fetch(SERVER + 'type-of-activity/', {
        method: "GET",
        headers: {
            'Authorization': 'Bearer ' + token,
        }
    })
        .then((res) => {
            if (res.status == 401) {
                needLogin()
            }
            if (res.status === 200 || res.status === 201) {
                return res.json()
            }
            else {
                return { error: "course error" }
            }
        }
        )
        .catch((error) => console.log(error)
        )
}

const taxationSystemGet = (token) => {
    return fetch(SERVER + 'taxation-system/', {
        method: "GET",
        headers: {
            'Authorization': 'Bearer ' + token,
        }
    })
        .then((res) => {
            if (res.status == 401) {
                needLogin()
            }
            if (res.status === 200 || res.status === 201) {
                return res.json()
            }
            else {
                return { error: "course error" }
            }
        }
        )
        .catch((error) => console.log(error)
        )
}
const getPackages = () => {
    // getCartProperties
    return fetch(`${SERVER}packages/`)
        .then((res) => {
            if (res.status === 200 || res.status === 201) {
                return res.json()
            }
            else {
                throw { error: "course error" }
            }
        }
        )
        .catch((error) => console.log(error));
}
const notificationComment = (inputData) => {
    return fetch(SERVER + "manager-notification-comment/", {
        method: 'POST',
        // headers: {
        //     "content-type": "application/json"
        // },
        body: inputData
    })
        .then(res => {
            if (res.status === 200 || res.status === 201)
                return res.json()
            return { error: true }
        })
        .catch((error) => console.log(error))
}
const companyFilePost = (inputData) => {
    return fetch(SERVER + "company-file/", {
        method: 'POST',
        body: inputData
    })
        .then(res => {
            if (res.status === 200 || res.status === 201)
                return res.json()
            return { error: true }
        })
        .catch((error) => console.log(error))
}
const getCompanyFile = (params) => {
    // getCartProperties
    return fetch(`${SERVER}company-file/${params}`)
        .then((res) => {
            if (res.status === 200 || res.status === 201) {
                return res.json()
            }
            else {
                throw { error: "file error" }
            }
        }
        )
        .catch((error) => console.log(error));
}
const getNewTaskCount = (params) => {
    const token = localStorage.getItem("token")
    return fetch(`${SERVER}get-new-task-count/`, {
        headers: {
            'Authorization': 'Bearer ' + token,
        }
    })
        .then((res) => {
            if (res.status === 200 || res.status === 201) {
                return res.json()
            }
            else {
                throw { error: "file error" }
            }
        }
        )
        .catch((error) => console.log(error));
}
export {
    // addEmployee,
    // addOrg,
    getReport,
    getCompanyFile,
    companyFilePost,
    getCompanyData,
    getPackages,
    taxationSystemGet,
    typeActivity,
    changeOrg,
    login_post,
    getMe,
    getMeById,
    getMyTasks,
    getStuff,
    newStuff,
    getAccountantCompany,
    AddAccountantCompany,
    addStuff,
    editStatus,
    // getAddStuff,
    getOrg,
    changeMyData,
    taskSms,
    getTasks,
    getTaskById,
    getClient,
    // getClientTaskNextPage,
    // getMyTasksStatus,
    // getAccountantTasks,
    getOrgData,
    getTaskByFilters,
    getClientByTd,
    sendArchive,
    changeEmployeeData,
    getEmployeeData,
    getSocial,
    newTask,
    getAccountantNextPage,
    getManagerNextPage,
    getManager,
    getNote,
    newNote,
    getNoteNextPage,
    delete_company,
    getTaskByFilter,
    newRepeatedTask,
    getMyRepeatedTasks,
    getRepeadTaskById,
    ChangeRepeatedTask,
    deleteNote,
    deleteArchive,
    deletenotification,
    newNotification,
    // getNotification,
    deleteNotification,
    // getNotifiacationextPage,
    getNotificationById,
    putNotificationById,
    getNotification,
    MultiTask,
    multiNewRepeatedTask,
    EditTask,
    timer,
    changeTimerById,
    deleteFile,
    newTaskByAccountant,
    // getOrgbyName,
    newFile,
    clientRate,
    notificationComment,
    companyService,
    deleteFileCompany,
    deleteRepeatedTask,
    getTaskTemplate,
    seenFiles,
    seenSms,
    getTaskSms,
    // getManagerReport,
    changeEmail,
    checkEmail,
    changeExistingPassword,
    getStaffType,
    todaysTaskSum,
    getNewTaskCount,
    get_deleted_companies_count,
    getTaskSmsesOnlyFile
    // addRaskEmployee,
    // updateMyToken,
    // uploadImage
};