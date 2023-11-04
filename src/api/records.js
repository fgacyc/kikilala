import {addDoc, deleteDoc, queryDoc, readAllDocs, readDoc, updateDoc} from "./firebase.js";

export async function addRecord(data) {
    let docID = await addDoc("records", data);
    if (docID === false) return false;
    return docID;
}
