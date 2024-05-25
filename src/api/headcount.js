import {addDoc, deleteDoc, readAllDocs, readDoc, updateDoc,queryDoc} from "./firebase.js";
import {withRetry} from "../tools.js";

const host_url = import.meta.env.VITE_HOST_URL;

// create
export async function addHeadcount1(data) {
    let docID = await addDoc("headcount", data);
    if (docID === false) return false;
    return docID;
}

export async function addHeadcount(headcountData){
    return await withRetry(async () => {
        const response = await fetch(`${host_url}/headcount`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(headcountData)
        });
        const data = await response.json();
        console.log(data)
        if (data.status === true) return data.data.uuid;
        throw new Error('Failed to add headcount');
    },2,1000);

}


// read all
export async function readAllHeadcounts1() {
    let docs = await readAllDocs("headcount");
    if (docs === false) return false;
    return docs;
}

export async function readAllHeadcounts() {
    return await withRetry(async () => {
        const response = await fetch(`${host_url}/headcount`, {
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


// update
export async function updateHeadcount1(docID, data) {
    let res = await updateDoc("headcount", data, docID);
    if (res === false) return false;
    return res;
}

export async function updateHeadcount(docID, headcount_data) {
    return await withRetry(async () => {
        const response = await fetch(`${host_url}/headcount/${docID}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(headcount_data)
        });
        const data = await response.json();
        if (data.status === true) return data.data;
        throw new Error('Failed to update headcount');
    },2,1000);

}

// delete
export async function deleteHeadcount1(docID) {
    let res = await deleteDoc("headcount", docID);
    if (res === false) return false;
    return res;
}

export async function deleteHeadcount(docID) {
    return await withRetry(async () => {
        const response = await fetch(`${host_url}/headcount/${docID}`, {
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
