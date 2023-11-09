import {addDoc, deleteDoc, queryDoc, readAllDocs, readDoc, updateDoc} from "./firebase.js";
import {set} from "idb-keyval";

export const CGStatusEnum = {
    active: 'active',
    closed: 'closed'
}


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

// close CG
export async function closeCG(docID) {
    const data = {
        CG_status: CGStatusEnum.closed
    }
    let res = await updateDoc("CGLs", data, docID);
    if (res === false) return false;
    return res;
}

export async function openCG(docID) {
    const data = {
        CG_status: CGStatusEnum.active
    }
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

// temp
// 1. add CG status to all CGs
// export async function updateCGStatus(docID, data) {
//     const cgls = await readAllCGLs();
//     data = {
//         CG_status : CGStatusEnum.active
//     }
//
//     for(let key in cgls){
//         await updateDoc("CGLs", data, key)
//         //console.log(key)
//     }
//     console.log("done")
//
//
//     return;
//     let res = await updateDoc("CGLs", data, docID);
//     if (res === false) return false;
//     return res;
// }

// 2. find duplicate CG name
export async function duplicateCheck(name) {
    const cgls = await readAllCGLs();
    let cg_name = [];
    for(let key in cgls){
        const item  = cgls[key];
        cg_name.push(item.CG_name.toLowerCase());
    }
    //console.log(cg_name.includes(name.toLowerCase()))
    return cg_name.includes(name.toLowerCase());
}

export async function findDuplicateCGName() {
    const cgls = await readAllCGLs();
    let cg_name = [];
    for(let key in cgls){
        const item  = cgls[key];
        cg_name.push(item.CG_name.toLowerCase());
    }

    let duplicate = [];
    let duplicate_name = [];
    for(let i = 0; i < cg_name.length; i++){
        for(let j = i + 1; j < cg_name.length; j++){
            if(cg_name[i] === cg_name[j]){
                duplicate.push(cg_name[i]);
            }
        }
    }
    console.log(duplicate)
}
