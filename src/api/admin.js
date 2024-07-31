import {addDoc, deleteDoc, readAllDocs, readDoc, updateDoc,queryDoc} from "./firebase.js";
import {withRetry} from "../tools.js";


const host_url = import.meta.env.VITE_HOST_URL;

// create
export async function addAdmin1(data) {
    let docID = await addDoc("admin", data);
    if (docID === false) return false;
    return docID;
}

export async function addAdmin(adminData) {
    return await withRetry(async () => {
        const response = await fetch(`${host_url}/admin`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(adminData)
        });
        const data = await response.json();
        console.log(data)
        if (data.status === true) return data.data.uuid;
        throw new Error('Failed to add attendance');
    },2,1000);
}



// read all
export async function readAllAdmins1() {
    let docs = await readAllDocs("admin");
    if (docs === false) return false;
    console.log(docs)
    return docs;
}

export async function readAllAdmins() {
    return await withRetry(async () => {
        const response = await fetch(`${host_url}/admin`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });
        const data = await response.json();
        if (data.status === true) {
            // console.log(data.data)
            return data.data
        };
        return false;
    },2,1000);
}


// update
export async function updateAdmin1(docID, data) {
    let res = await updateDoc("admin", data, docID);
    if (res === false) return false;
    return res;
}

export async function updateAdmin(docID, admin_data) {
    return await withRetry(async () => {
        const response = await fetch(`${host_url}/admin/${docID}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(admin_data)
        });
        const data = await response.json();
        if (data.status === true) return data.data;
        throw new Error('Failed to update admin');
    },2,1000);
}

// delete
export async function deleteHeadcount1(docID) {
    if (docID === "0Uj2nD8o3ZaM8GIyqX3e") return false; //phoebe
    if (docID === "UOoCP6RRKT4ue39YqRq7") return false; //Innis

    let res = await deleteDoc("admin", docID);
    if (res === false) return false;
    return res;
}

export async function deleteAdmin(docID) {
    return await withRetry(async () => {
        const response = await fetch(`${host_url}/admin/${docID}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
        });
        const data = await response.json();
        if (data.status === true) return true;
        return false;
    },2,1000);
}

// query
export async function queryAdminEmail1(email) {
    if (!email) return false;
    const query = ["email", "==", email];
    const doc = await queryDoc("admin", query);
    if (doc === false) return false;
    return doc;
}

export async function queryAdminEmail(email) {
    return await withRetry(async () => {
        const response = await fetch(`${host_url}/admin/email/${email}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });
        const data = await response.json();
        if (data.status === true) return data.data;
        return false;
    },2,1000);
}
