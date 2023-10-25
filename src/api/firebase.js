import { FBStore } from '../firebase/storeHandler.js';

const fbStore = new FBStore();

// create
export async function addDoc(collection, document) {
    document.createdAt = new Date();
    document.updatedAt = new Date();
    try {
        let docid = await fbStore.write(collection, document);
        return docid;
    } catch (err) {
        console.log(err);
        return false;
    }
}

export async function setDoc(collection, document, docID) {
    document.createdAt = new Date();
    document.updatedAt = new Date();
    try {
        let docid = await fbStore.write(collection, document, docID);
        return docid;
    } catch (err) {
        console.log(err);
        return false;
    }
}

// read
export async function readDoc(collection, docid) {
    try {
        let doc = await fbStore.readDocument(collection, docid);
        return doc;
    } catch (err) {
        console.log(err);
        return false;
    }
}

export async function readAllDocs(collection) {
    try {
        let docs = await fbStore.readCollection(collection);
        return docs;
    } catch (err) {
        console.log(err);
        return false;
    }
}

// update
export async function updateDoc(collection, document, docid) {
    document.updatedAt = new Date();
    try {
        let res = await fbStore.update(collection, document, docid);
        return res;
    } catch (err) {
        console.log(err);
        return false;
    }
}

// delete
export async function deleteDoc(collection, docid) {
    try {
        let res = await fbStore.delete(collection, docid);
        return res;
    } catch (err) {
        console.log(err);
        return false;
    }
}

// query
export async function queryDoc(collection, query) {
    try {
        let res = await fbStore.query(collection, query);
        return res;
    } catch (err) {
        console.log(err);
        return false;
    }
}
