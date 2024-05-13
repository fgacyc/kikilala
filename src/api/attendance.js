import {addDoc, deleteDoc, readAllDocs, readDoc, updateDoc,queryDoc} from "./firebase.js";
import {withRetry} from "../tools.js";

const host_url = import.meta.env.VITE_HOST_URL;
// create
export async function addAttend1(data) {
    let docID = await addDoc("attendance", data);
    if (docID === false) return false;
    return docID;
}

export async function addAttend(attendData){
    return await withRetry(async () => {
        const response = await fetch(`${host_url}/attendance`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(attendData)
        });
        const data = await response.json();
        if (data.status === true) return data.data.uuid;
        throw new Error('Failed to add attendance');
    },2,500);
}



// read all
export async function readAllAttends1() {
    let docs = await readAllDocs("attendance");
    if (docs === false) return false;
    return docs;
}

export async function readAllAttends() {
    const response = await fetch(`${host_url}/attendance`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
    });
    const data = await response.json();
    if (data.status === true) return data.data;
    return false;
}


// query by date
export  async  function queryAttends1(date){
    if (!date) return false;
    // console.log(date)
    const query = ["date", "==",date]
    const doc = await queryDoc("attendance", query);
    if (doc === false) return false;
    console.log(doc)
    return doc;
}

export async function queryAttends(date){
    if (!date) return false;
    date = date.replaceAll('/','+');
    const response = await fetch(`${host_url}/attendance/${date}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
    });
    const data = await response.json();
    if (data.status === true) {
        //console.log(data.data);
        return data.data;
    }
    return false;
}

// query by cg name
export async function readAttendByCGName1(cg_name) {
    console.log(cg_name)
    const query = ["cg_name", "==", cg_name];
    let doc = await queryDoc("attendance", query);
    if (doc === false) return false;
    for (let i = 0; i < doc.length; i++) {
        doc[i].key = String(i);
    }
    // console.log(doc)
    return doc;
}

export async function readAttendByCGId(cg_id) {
    return await withRetry(async () => {
        const response = await fetch(`${host_url}/attendance/cg/${cg_id}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });
        const data = await response.json();
        if (data.status === true) return data.data;
        throw new Error('Failed to read attendance by cg id');
    },2,500);
}

// update
export async function updateAttend1(docID, data) {
    let res = await updateDoc("attendance", data, docID);
    if (res === false) return false;
    return res;
}

export async function updateAttend(docID, data) {
    const response = await fetch(`${host_url}/attendance/${docID}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data)
    });
    const res = await response.json();
    if (res.status === true) return res.data;
    return false;
}

// delete
export async function deleteAttend1(docID) {
    let res = await deleteDoc("attendance", docID);
    if (res === false) return false;
    return res;
}

export async function deleteAttend(docID) {
    const response = await fetch(`${host_url}/attendance/${docID}`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
        },
    });
    const res = await response.json();
    return res.status === true;
}


export async function checkDuplicate1(date, cg_id) {
    let queries = [["date", "==", date], ["cg_id", "==", cg_id]];
    const doc = await queryDoc("attendance", queries);
    if (doc === false) return true;
    return doc.length > 0;
}

export async function checkDuplicate(date, cg_id) {
    if (!date) return false;
    date = date.replaceAll('/','+');
    return await withRetry(async () => {
        const response = await fetch(`${host_url}/attendance/check/${date}/${cg_id}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });
        const data = await response.json();
        return data.status === true;
    },2,500);
}




export async function getAttendByPastoralTeam(name){
    console.log(name)
    if (!name) return false;
    if(name === "all"){
        const data = await readAllAttends();
        return Object.values(data);
    }

    if(name === "kuchai_young_warrior"){
        let data = await readAllAttends();
        data = Object.values(data);
        // console.log(data.filter(item => item.satellite === "Kuchai YW"))
        return data.filter(item => item.satellite === "Kuchai YW");
    }


    const query = ["pastoral_team", "==",name]
    const doc = await queryDoc("attendance", query);
    if (doc === false) return false;
    return doc;
}

///2023/10/30-2023/11/05

export function filterAttendByDate(data,duration){
    if(duration==="all") return data;
    const dates = duration.split('-');
    const startDate = new Date(dates[0]);
    const endDate = new Date(dates[1]);
    let res = [];
    for (let item of data){
        const itemDate =item.date.split('-');
        const itemStartDate = new Date(itemDate[0]);
        const itemEndDate = new Date(itemDate[1]);
        if (itemStartDate >= startDate && itemEndDate <= endDate){
            res.push(item);
        }
    }
    return res;
}

export function filterHeadcountByDate(data,duration){
    // console.log(data)
    const dates = duration.split('-');
    const startDate = new Date(dates[0]+ " 00:00:00");
    const endDate = new Date(dates[1]+ " 23:59:59");
    // console.log(startDate)
    // console.log(endDate)
    let res = [];
    for (let item of data){
        const itemDatetime = new Date(item.dateTime);
        if (itemDatetime >= startDate && itemDatetime <= endDate){
            res.push(item);
        }
    }
    return res;
}
