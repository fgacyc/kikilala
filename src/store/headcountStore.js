import {create} from 'zustand'
import {useFormStore} from "./formStore.js";
import {Message} from "@arco-design/web-react";

export const useHeadCountStore = create((set) => ({
    satellite: "",
    dateTime: "",
    serviceType: "",
    headCount: "",
    kids_num: "",
    cm_num: "",
    parents_num: "",
    yw_num: "",
    gs_num: "",
    yp_num: "",
    comment: "",

    setSatellite: (satellite) => set({satellite}),
    setDateTime: (dateTime) => set({dateTime}),
    setServiceType: (serviceType) => set({serviceType}),
    setHeadCount: (headCount) => set({headCount}),
    setKidsNum: (kids_num) => set({kids_num}),
    setCMNum: (cm_num) => set({cm_num}),
    setParentsNum: (parents_num) => set({parents_num}),
    setYWNum: (yw_num) => set({yw_num}),
    setGSNum: (gs_num) => set({gs_num}),
    setYPNum: (yp_num) => set({yp_num}),
    setComment: (comment) => set({comment}),

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

        if (useFormStore.getState().total_members_num === "") {
            Message.warning("Please enter a head count");
            return false;
        }

        if (useHeadCountStore.getState().kids_num === "") {
            Message.warning("Please enter a kids number");
            return false;
        }

        if (useHeadCountStore.getState().cm_num === "") {
            Message.warning("Please enter a CM number");
            return false;
        }

        if (useHeadCountStore.getState().parents_num === "") {
            Message.warning("Please enter a parents number");
            return false;
        }

        if (useHeadCountStore.getState().yw_num === "") {
            Message.warning("Please enter a YW number");
            return false;
        }

        if (useHeadCountStore.getState().gs_num === "") {
            Message.warning("Please enter a GS number");
            return false;
        }

        if (useHeadCountStore.getState().yp_num === "") {
            Message.warning("Please enter a YP number");
            return false;
        }

        // comment is optional
        // if (useHeadCountStore.getState().comment === "") {
        //     Message.warning("Please enter a comment");
        //     return false;
        // }

        if( useFormStore.getState().user_sub === "") {
            Message.warning("Please login again");
            return false;
        }

    },


    getHeadCountData: () => {
        if( useHeadCountStore.getState().validateHeadCount() === false) return ;
        return {
            satellite: useHeadCountStore.getState().satellite,
            dateTime: useHeadCountStore.getState().dateTime,
            serviceType: useHeadCountStore.getState().serviceType,
            headCount: useFormStore.getState().total_members_num,
            kids_num: useHeadCountStore.getState().kids_num,
            cm_num: useHeadCountStore.getState().cm_num,
            parents_num: useHeadCountStore.getState().parents_num,
            yw_num: useHeadCountStore.getState().yw_num,
            gs_num: useHeadCountStore.getState().gs_num,
            yp_num: useHeadCountStore.getState().yp_num,
            comment: useHeadCountStore.getState().comment,
            user_sub: useFormStore.getState().user_sub,
            user_email: useFormStore.getState().user_email,
        }
    },
}))
