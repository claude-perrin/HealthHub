//get all the patients from the admin api

import { adminPath, adminUsersPath } from "./apiPaths"


let jsonHeader = {
    'Content-Type': 'application/json'
}
export async function getPatients() {
    const result = await fetch(`${adminPath}?role=PATIENT` , {
        method: "GET",
    })
    return result.json()
}

//get all the doctors from the admin api
export async function getDoctors() {
    const result = await fetch(`${adminPath}?role=DOCTOR` , {
        method: "GET",
    })
    return result.json()
}

//get all the receptionists from the admin api
export async function getReceptionists() {

    const result = await fetch(`${adminPath}?role=RECEPTIONIST` , {
        method: "GET",
    })
    return result.json()
}

//get all the lab supervisors from the admin api
export async function getLabSupervisors() {
    const result = await fetch(`${adminPath}?role=LAB_SUPERVISOR` , {
        method: "GET",
    })
    return result.json()
}

//get all the lab assistans from the admin api
export async function getLabTechnicians() {
    const result = await fetch(`${adminPath}?role=LAB_ASSISTANT` , {
        method: "GET",
    })
    return result.json()
}

//ban user based  on the id
// ban user based on the id
export async function banUser(id: string) {
    const result = await fetch(`${adminPath}?id=${id}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ isActive: false }),
    });
    return result.json();
}

// unban user based on the id
export async function unbanUser(id: string) {
    const result = await fetch(`${adminPath}?id=${id}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ isActive: true }), 
    });
    return result.json();
}

export async function getUserInfoWithId(userId) {
    const result = await fetch(`${adminUsersPath}/${userId}`, {
        method: 'GET',
    })
    return result
}


export async function updateUserInfo(userData, userId) {
    const result = await fetch(`${adminUsersPath}/${userId}`, {
        method: 'PUT',
        headers: jsonHeader,
        body: JSON.stringify(userData)
    })

    return result;
}