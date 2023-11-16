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

export  async  function queryAttends(date){
    if (!date) return false;
    // console.log(date)
    const query = ["date", "==",date]
    const doc = await queryDoc("attendance", query);
    if (doc === false) return false;
    return doc;
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


export async function checkDuplicate(date, cg_id) {
    let queries = [["date", "==", date], ["cg_id", "==", cg_id]];
    const doc = await queryDoc("attendance", queries);
    if (doc === false) return true;
    return doc.length > 0;
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
    const dates = duration.split('-');
    const startDate = new Date(dates[0]);
    const endDate = new Date(dates[1]);
    let res = [];
    for (let item of data){
        const itemDatetime = new Date(item.dateTime);
        // console.log(itemDatetime)
        if (itemDatetime >= startDate && itemDatetime <= endDate){
            res.push(item);
        }
    }
    return res;
}
