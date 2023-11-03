import {addDoc, deleteDoc, readAllDocs, readDoc, updateDoc,queryDoc} from "./firebase.js";

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

export async function readAttendByCGName(cg_name) {
    const query = ["cg_name", "==", cg_name];
    let doc = await queryDoc("attendance", query);
    if (doc === false) return false;
    for (let i = 0; i < doc.length; i++) {
        doc[i].key = String(i);
    }
    // console.log(doc)
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
    let res = await updateDoc("attendance", data, docID);
    if (res === false) return false;
    return res;
}

// delete
export async function deleteAttend(docID) {
    let res = await deleteDoc("attendance", docID);
    if (res === false) return false;
    return res;
}
