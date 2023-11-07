import {addDoc, deleteDoc, readAllDocs, readDoc, updateDoc,queryDoc} from "./firebase.js";

// create
export async function addAdmin(data) {
    let docID = await addDoc("admin", data);
    if (docID === false) return false;
    return docID;
}

// read
export async function readAdmin(docID) {
    let doc = await readDoc("admin", docID);
    if (doc === false) return false;
    return doc;
}



// read all
export async function readAllAdmins() {
    let docs = await readAllDocs("admin");
    if (docs === false) return false;
    return docs;
}


// update
export async function updateAdmin(docID, data) {
    let res = await updateDoc("admin", data, docID);
    if (res === false) return false;
    return res;
}

// delete
export async function deleteHeadcount(docID) {
    if (docID === "FsQCE0JWginq9UxsrOb2") return false;
    if (docID === "IN68IgvWqxfPXlI8FP6z") return false;

    let res = await deleteDoc("admin", docID);
    if (res === false) return false;
    return res;
}
