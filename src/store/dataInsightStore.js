import { create } from 'zustand'

export const useDataInsightStore = create((set) => ({
    attendanceData : null,
    connectGroupData : null,
    setAttendanceData: (attendanceData) => {
        if (attendanceData !== null ) {
            set({attendanceData})
        }
    },
    setConnectGroupData: (connectGroupData) => {
        if (connectGroupData !== null ) {
            set({connectGroupData})
        }
    },
}))
