import {addDoc, deleteDoc, readAllDocs, readDoc, updateDoc,queryDoc} from "./firebase.js";

// create
export async function addHeadcount(data) {
    let docID = await addDoc("headcount", data);
    if (docID === false) return false;
    return docID;
}

// read
export async function readHeadcount(docID) {
    let doc = await readDoc("headcount", docID);
    if (doc === false) return false;
    return doc;
}

// export async function readAttendByCGName(cg_name) {
//     const query = ["cg_name", "==", cg_name];
//     let doc = await queryDoc("headcount", query);
//     if (doc === false) return false;
//     for (let i = 0; i < doc.length; i++) {
//         doc[i].key = String(i);
//     }
//     // console.log(doc)
//     return doc;
// }

// read all
export async function readAllHeadcounts() {
    let docs = await readAllDocs("headcount");
    if (docs === false) return false;
    return docs;
}

// export  async  function queryAttends(date){
//     if (!date) return false;
//     // console.log(date)
//     const query = ["date", "==",date]
//     const doc = await queryDoc("headcount", query);
//     if (doc === false) return false;
//     return doc;
// }

// update
export async function updateHeadcount(docID, data) {
    let res = await updateDoc("headcount", data, docID);
    if (res === false) return false;
    return res;
}

// delete
export async function deleteHeadcount(docID) {
    let res = await deleteDoc("headcount", docID);
    if (res === false) return false;
    return res;
}
