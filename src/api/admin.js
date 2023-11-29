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
    if (docID === "0Uj2nD8o3ZaM8GIyqX3e") return false; //phoebe
    if (docID === "UOoCP6RRKT4ue39YqRq7") return false; //Innis

    let res = await deleteDoc("admin", docID);
    if (res === false) return false;
    return res;
}

// query
export async function queryAdminEmail(email) {
    if (!email) return false;
    const query = ["email", "==", email];
    const doc = await queryDoc("admin", query);
    if (doc === false) return false;
    return doc;
}
