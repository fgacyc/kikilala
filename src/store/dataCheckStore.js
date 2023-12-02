import { create } from 'zustand'

export const useDataCheckStore = create((set) => ({
    incompleteRecordsList : [],
    duplicateRecordsList : [],

    addIncompleteRecord: (record) => set(state => {
        const incompleteRecordsList = [...state.incompleteRecordsList, record]
        return {incompleteRecordsList}
    }),
    setDuplicateRecordsList: (list) => set(state => {
        return {duplicateRecordsList: list}
    }),
    addDuplicateRecord: (record) => set(state => {
        const duplicateRecordsList = [...state.duplicateRecordsList, record]
        return {duplicateRecordsList}
    }),
}))
