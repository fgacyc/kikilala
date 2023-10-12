import {addDoc, deleteDoc, readAllDocs, readDoc, updateDoc} from "./firebase.js";

// create
export async function addAttend(data) {
    let docID = await addDoc("attendance", data);
    if (docID === false) return false;
    return docID;
}

// read
export async function readAttend(docID) {
    let doc = await readDoc("attendance", docID);
    if (doc === false) return false;
    return doc;
}

// read all
export async function readAllAttends() {
    let docs = await readAllDocs("attendance");
    if (docs === false) return false;
    return docs;
}

// update
export async function updateAttend(docID, data) {
    let res = await updateDoc("attendance", docID, data);
    if (res === false) return false;
    return res;
}

// delete
export async function deleteAttend(docID) {
    let res = await deleteDoc("attendance", docID);
    if (res === false) return false;
    return res;
}
