import { create } from 'zustand'
import {getWeekDatesArray} from "../pages/formPage/data.js";

export const useAttendanceStore = create((set) => ({
    currentSubmitData:null,
    currentPendingData:null,
    currentWeek:"",
    currentCGNumber:0,
    showSubmitted:true,
    currentCGLs : [],

    setCurrentSubmitData: (currentSubmitData) => set({ currentSubmitData }),
    setCurrentPendingData: (currentPendingData) => set({ currentPendingData }),
    setCurrentWeek: (currentWeek) => {
        set({ currentWeek })
        localStorage.setItem("currentWeek",currentWeek)
    },
    setCurrentCGNumber: (currentCGNumber) => set({ currentCGNumber }),
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
    setCurrentCGLs: (currentCGLs) => set({ currentCGLs }),
}))
