import { create } from 'zustand'

export const useAttendanceStore = create((set) => ({
    currentSubmitData:null,

    setCurrentSubmitData: (currentSubmitData) => set({ currentSubmitData }),
}))
