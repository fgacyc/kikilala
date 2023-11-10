import { create } from 'zustand'
import {getWeekDatesArray} from "../pages/formPage/data.js";

export const useAttendanceStore = create((set) => ({
    currentSubmitData:null,
    currentPendingData:null,
    currentWeek:"",
    showSubmitted:true,

    setCurrentSubmitData: (currentSubmitData) => set({ currentSubmitData }),
    setCurrentPendingData: (currentPendingData) => set({ currentPendingData }),
    setCurrentWeek: (currentWeek) => {
        set({ currentWeek })
        localStorage.setItem("currentWeek",currentWeek)
    },
    setShowSubmitted: (showSubmitted) => {
        set({ showSubmitted })
        localStorage.setItem("showSubmitted",showSubmitted)
    },
    initAttendData: () => {
        const currentWeek = localStorage.getItem("currentWeek") || getWeekDatesArray(4)[3];
        let showSubmitted = localStorage.getItem("showSubmitted") || true;
        showSubmitted = showSubmitted === "true";
        set({ currentWeek,showSubmitted })
    },
}))
