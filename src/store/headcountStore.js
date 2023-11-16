import {create} from 'zustand'
import {useFormStore} from "./formStore.js";
import {Message} from "@arco-design/web-react";

export const useHeadCountStore = create((set) => ({
    satellite: "",
    dateTime: "",
    serviceType: "",
    headCount: 0,
    kids_num: "",
    cm_num: "",
    parents_num: "",
    yw_num: "",
    gs_num: "",
    nf_num: "",
    comment: "",
    ac_num: "",

    // key ,for edit
    key: "",

    setSatellite: (satellite) => {
        localStorage.setItem("headcount-satellite", satellite);
        set({satellite});
    },
    setDateTime: (dateTime) => set({dateTime}),
    setServiceType: (serviceType) => set({serviceType}),
    setHeadCount: (headCount) => {
        if (headCount < 0) set({headCount: 0})
        else set({headCount})
    },
    setKidsNum: (kids_num) => {
        if (kids_num < 0) set({kids_num: 0})
        else set({kids_num})
    },
    setCMNum: (cm_num) => {
        if (cm_num < 0) set({cm_num: 0})
        else set({cm_num})
    },
    setParentsNum: (parents_num) => {
        if (parents_num < 0) set({parents_num: 0})
        else set({parents_num})
    },
    setYWNum: (yw_num) => {
        if (yw_num < 0) set({yw_num: 0})
        else set({yw_num})
    },
    setGSNum: (gs_num) => {
        if (gs_num < 0) set({gs_num: 0})
        else set({gs_num})
    },
    setNFNum: (nf_num) => {
        if (nf_num < 0) set({nf_num: 0})
        else set({nf_num})
    },
    setComment: (comment) => set({comment}),
    setKey: (key) => set({key}),

    setACNum: (ac_num) => {
        if (ac_num < 0) set({ac_num: 0})
        else set({ac_num})
    },

    validateHeadCount: () => {
        if (useHeadCountStore.getState().satellite === "") {
            Message.warning("Please select a satellite");
            return false;
        }

        if (useHeadCountStore.getState().dateTime === "") {
            Message.warning("Please select a date");
            return false;
        }

        if (useHeadCountStore.getState().serviceType === "") {
            Message.warning("Please select a service type");
            return false;
        }


        if (!(useHeadCountStore.getState().headCount)) {
            Message.warning("Please enter a head count");
            return false;
        }


        if (useFormStore.getState().user_sub === "") {
            Message.warning("Please login again");
            return false;
        }

        // console.log(useHeadCountStore.getState().dateTime)
        //console.log(useHeadCountStore.getState().dateTime.substring(11, 19))
        if (useHeadCountStore.getState().dateTime.substring(11, 19) === "00:00:00") {
            Message.warning("Please select service time");
            return false;
        }

        if (useFormStore.getState().kids_num === "") {
            useFormStore.getState().setKidsNum(0);
        }
        if (useHeadCountStore.getState().cm_num === "") {
            useHeadCountStore.getState().setCMNum(0);
        }
        if (useHeadCountStore.getState().parents_num === "") {
            useHeadCountStore.getState().setParentsNum(0);
        }
        if (useHeadCountStore.getState().yw_num === "") {
            useHeadCountStore.getState().setYWNum(0);
        }
        if (useHeadCountStore.getState().gs_num === "") {
            useHeadCountStore.getState().setGSNum(0);
        }
        if (useHeadCountStore.getState().nf_num === "") {
            useHeadCountStore.getState().setNFNum(0);
        }
        if (useHeadCountStore.getState().ac_num === "") {
            useHeadCountStore.getState().setACNum(0);
        }
        return true;
    },


    getHeadCountData: (type) => {
        if (useHeadCountStore.getState().validateHeadCount(type) === false) return;
        return {
            satellite: useHeadCountStore.getState().satellite,
            dateTime: useHeadCountStore.getState().dateTime,
            serviceType: useHeadCountStore.getState().serviceType,
            headCount: useHeadCountStore.getState().headCount,
            kids_num: useHeadCountStore.getState().kids_num,
            cm_num: useHeadCountStore.getState().cm_num,
            parents_num: useHeadCountStore.getState().parents_num,
            yw_num: useHeadCountStore.getState().yw_num,
            gs_num: useHeadCountStore.getState().gs_num,
            nf_num: useHeadCountStore.getState().nf_num,
            comment: useHeadCountStore.getState().comment,
            user_sub: useFormStore.getState().user_sub,
            user_email: useFormStore.getState().user_email,
            ac_num: useHeadCountStore.getState().ac_num,
        }
    },

    setHeadCountData: (data) => {
        // console.log("setHeadCountData", data)
        set({satellite: data.satellite});
        set({dateTime: data.dateTime});
        set({serviceType: data.serviceType});
        set({headCount: data.headCount});
        set({kids_num: data.kids_num});
        set({cm_num: data.cm_num});
        set({parents_num: data.parents_num});
        set({yw_num: data.yw_num});
        set({gs_num: data.gs_num});
        set({nf_num: data.nf_num});
        set({comment: data.comment});
        set({key: data.key});
        set({ac_num: data.ac_num});
    },

    resetHeadCountData: () => {
        set({headCount: 0});
        set({kids_num: ""});
        set({cm_num: ""});
        set({parents_num: ""});
        set({yw_num: ""});
        set({gs_num: ""});
        set({nf_num: ""});
        set({comment: ""});
        set({key: ""});
        set({ac_num: ""});
    },
}))
