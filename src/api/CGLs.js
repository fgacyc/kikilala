import {addDoc, deleteDoc, readAllDocs, readDoc, updateDoc} from "./firebase.js";

// create
export async function addCGL(data) {
    let docID = await addDoc("CGLs", data);
    if (docID === false) return false;
    return docID;
}

// read
export async function readCGL(docID) {
    let doc = await readDoc("CGLs", docID);
    if (doc === false) return false;
    return doc;
}

// read all
export async function readAllCGLs() {
    let docs = await readAllDocs("CGLs");
    if (docs === false) return false;
    return docs;
}

// update
export async function updateCGL(docID, data) {
    let res = await updateDoc("CGLs", docID, data);
    if (res === false) return false;
    return res;
}

// delete
export async function deleteCGL(docID) {
    let res = await deleteDoc("CGLs", docID);
    if (res === false) return false;
    return res;
}