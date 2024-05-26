import {addDoc, deleteDoc, readAllDocs, updateDoc} from "./firebase.js";
import {set} from "idb-keyval";
import {withRetry} from "../tools.js";

export const CGStatusEnum = {
    active: 'active',
    closed: 'closed'
}

const host_url = import.meta.env.VITE_HOST_URL;


// create
export async function addCGL1(data) {
    let docID = await addDoc("CGLs", data);
    if (docID === false) return false;
    return docID;
}

export async function addCGL(cgData){
    return await withRetry(async () => {
        const response = await fetch(`${host_url}/cg`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(cgData)
        });
        const data = await response.json();
        console.log(data)
        if (data.status === true) return data.data.uuid;
        throw new Error('Failed to add CG');
    },2,1000);

}



// read all
export async function readAllCGLs1() {
    let docs = await readAllDocs("CGLs");
    if (docs === false) return false;
    set("kikilala-CGLs", docs);
    set("kikilala-CGLs-updatedAt", new Date());
    for (let key in docs) {
        docs[key].CG_id = key;
    }
    return docs;
}

export async function readAllCGLs(){
    return await withRetry(async () => {
        const response = await fetch(`${host_url}/cg`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });
        const data = await response.json();
        if (data.status === true) return data.data;
        throw new Error('Failed to read all CGs');
    },2,1000);

}

export async function readAllActiveCGLs1() {
    let docs = await readAllDocs("CGLs");
    if (docs === false) return false;
    for (let key in docs) {
        docs[key].CG_id = key;
        docs[key].key = key;
    }
    const dataList = Object.keys(docs).map((key) => docs[key]);
    // sort by updatedAt
    dataList.sort((a, b) => {
        return new Date(b.updatedAt.seconds) - new Date(a.updatedAt.seconds);
    });


    return dataList.filter((item) => item.CG_status === CGStatusEnum.active);
}

export async function readAllActiveCGLs(){
    return await withRetry(async () => {
        const response = await fetch(`${host_url}/cg/active`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });
        const data = await response.json();
        if (data.status === true) return data.data;
        throw new Error('Failed to read all active CGs');
    });

}

export async function readAllClosedCGLs1() {
    let docs = await readAllDocs("CGLs");
    if (docs === false) return false;
    for (let key in docs) {
        docs[key].CG_id = key;
        docs[key].key = key;
    }
    const dataList = Object.keys(docs).map((key) => docs[key]);
    return dataList.filter((item) => item.CG_status === CGStatusEnum.closed);
}

export async function readAllClosedCGLs(){
    return await withRetry(async () => {
        const response = await fetch(`${host_url}/cg/closed`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });
        const data = await response.json();
        if (data.status === true) return data.data;
        throw new Error('Failed to read all closed CGs');
    });


}

// update
export async function updateCGL1(docID, data) {
    let res = await updateDoc("CGLs", data, docID);
    if (res === false) return false;
    return res;
}

export async function updateCGL(docID,cgData){
    return await withRetry(async () => {
           const response = await fetch(`${host_url}/cg/${docID}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(cgData)
            });
            const data = await response.json();
            if (data.status === true) {
                // console.log(data)
                return data.data
            };
            throw new Error('Failed to update CG');
    },2,1000);

}

// close CG
export async function closeCG1(docID) {
    const data = {
        CG_status: CGStatusEnum.closed
    }
    let res = await updateDoc("CGLs", data, docID);
    if (res === false) return false;
    return res;
}

export async function closeCG(cg_id){
    return await withRetry(async () => {
        const response = await fetch(`${host_url}/cg/close/${cg_id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
        });
        const data = await response.json();
        if (data.status === true) return data.data;
        throw new Error('Failed to close CG');
    },2,1000);


}


// open CG
export async function openCG1(docID) {
    const data = {
        CG_status: CGStatusEnum.active
    }
    let res = await updateDoc("CGLs", data, docID);
    if (res === false) return false;
    return res;
}

export async function openCG(cg_id){
    return await withRetry(async () => {
        const response = await fetch(`${host_url}/cg/open/${cg_id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
        });
        const data = await response.json();
        if (data.status === true) return data.data;
        throw new Error('Failed to open CG');
    },2,1000);


}


// delete
export async function deleteCGL1(docID) {
    let res = await deleteDoc("CGLs", docID);
    if (res === false) return false;
    return res;
}

export async function deleteCGL(cg_id){
    return await withRetry(async () => {
        const response = await fetch(`${host_url}/cg/${cg_id}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
        });
        const data = await response.json();
        if (data.status === true) return data.data;
        throw new Error('Failed to delete CG');
    },2,1000);
}


// get CG number
export  async  function  getCGLNum1(){
    const data = await readAllActiveCGLs();
    return data.length;
}


export async function getCGLNum() {
    return await withRetry(async () => {
        const response = await fetch(`${host_url}/cg/num`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });
        const data = await response.json();
        if (data.status === true) return data.data;
        throw new Error('Failed to get CG number');
    })
}



// 2. find duplicate CG name
export async function duplicateCheck1(name) {
    const cgls = await readAllCGLs();
    let cg_name = [];
    for(let key in cgls){
        const item  = cgls[key];
        cg_name.push(item.CG_name.toLowerCase());
    }
    //console.log(cg_name.includes(name.toLowerCase()))
    return cg_name.includes(name.toLowerCase());
}

export async function duplicateCheck(name){
    return await withRetry(async () => {
        const response = await fetch(`${host_url}/cg/duplicate/${name}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });
        const data = await response.json();
        if (data.status === true) return data.data;
        throw new Error('Failed to check duplicate CG name');
    },2,1000);

}


export async function absentCGLs(SubmitData){
    let submitCGIDArray = SubmitData.map((item) => item.cg_id);
    let absentCGLs = [];
    const allCGLsData = await readAllActiveCGLs();
    for (let item of allCGLsData) {
        const CG_id = item.CG_id;
        item.key = CG_id;
        if(!submitCGIDArray.includes(CG_id)){
            absentCGLs.push(item);
        }
    }
    return absentCGLs;
}
