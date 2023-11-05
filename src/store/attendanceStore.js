import { create } from 'zustand'

export const useAttendanceStore = create((set) => ({
    currentSubmitData:null,
    currentWeek:"",
    showSubmitted:true,

    setCurrentSubmitData: (currentSubmitData) => set({ currentSubmitData }),
    setCurrentWeek: (currentWeek) => {
        set({ currentWeek })
        localStorage.setItem("currentWeek",currentWeek)
    },
    setShowSubmitted: (showSubmitted) => {
        set({ showSubmitted })
        localStorage.setItem("showSubmitted",showSubmitted)
    },
    initAttendData: () => {
        const currentWeek = localStorage.getItem("currentWeek") || "";
        let showSubmitted = localStorage.getItem("showSubmitted") || true;
        showSubmitted = showSubmitted === "true";
        set({ currentWeek,showSubmitted })
    },
}))
