import {addDoc, deleteDoc, queryDoc, readAllDocs, readDoc, updateDoc} from "./firebase.js";
import {set} from "idb-keyval";

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
    set("kikilala-CGLs", docs);
    set("kikilala-CGLs-updatedAt", new Date());
    for (let key in docs) {
        docs[key].CG_id = key;
    }
    return docs;
}

// update
export async function updateCGL(docID, data) {
    let res = await updateDoc("CGLs", data, docID);
    if (res === false) return false;
    return res;
}

// delete
export async function deleteCGL(docID) {
    let res = await deleteDoc("CGLs", docID);
    if (res === false) return false;
    return res;
}

export async function readCGLNameByCGName(cg_name) {
    // console.log(cg_name)
    const query = ["CG_name", "==", cg_name];
    let doc = await queryDoc("CGLs", query);
    if (doc == false) return false;
    return doc[0]
}


export  async  function  getCGLNum(){
    const data = await readAllCGLs();
    // console.log(Object.keys(data).length)
    return Object.keys(data).length;
}
