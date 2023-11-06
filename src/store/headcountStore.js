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

    // key ,for edit
    key: "",

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
    setKey: (key) => set({key}),

    validateHeadCount: (type) => {
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
        if(type === "form"){
            if (useFormStore.getState().total_members_num === "") {
                Message.warning("Please enter a head count");
                return false;
            }
        }

        if(type === "drawer"){
            if (useHeadCountStore.getState().headCount === "") {
                Message.warning("Please enter a head count");
                return false;
            }
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


    getHeadCountData: (type) => {
        if( useHeadCountStore.getState().validateHeadCount(type) === false) return ;
        return {
            satellite: useHeadCountStore.getState().satellite,
            dateTime: useHeadCountStore.getState().dateTime,
            serviceType: useHeadCountStore.getState().serviceType,
            headCount: type==="form"? useFormStore.getState().total_members_num:useHeadCountStore.getState().headCount,
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
        set({yp_num: data.yp_num});
        set({comment: data.comment});
        set({key: data.key});
//         useHeadCountStore.getState().setSatellite(data.satellite);
//         useHeadCountStore.getState().setDateTime(data.dateTime);
//         useHeadCountStore.getState().setServiceType(data.serviceType);
//         useHeadCountStore.getState().setHeadCount(data.headCount);
//         useHeadCountStore.getState().setKidsNum(data.kids_num);
//         useHeadCountStore.getState().setCMNum(data.cm_num);
//         useHeadCountStore.getState().setParentsNum(data.parents_num);
//         useHeadCountStore.getState().setYWNum(data.yw_num);
//         useHeadCountStore.getState().setGSNum(data.gs_num);
//         useHeadCountStore.getState().setYPNum(data.yp_num);
//         useHeadCountStore.getState().setComment(data.comment);
// useHeadCountStore.getState().setKey(data.key);

    },
}))
