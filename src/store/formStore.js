import {create} from 'zustand'
import {get} from "idb-keyval";

export const useFormStore = create((set) => ({
    satellite: "",
    pastoral_team: "",
    cgl_name: "",
    cg_name: "",
    date: "",
    total_members_num: "",
    cg_id: "",

    // cg activity attendance
    cg_om_num: 0,
    cg_nb_num: 0,
    cg_nf_num: 0,
    cg_rnf_num: 0,
    cg_ac_num: 0,
    cg_abs_num: 0,
    cg_absence_reason: "",

    // service attendance
    service_om_num: 0,
    service_nb_num: 0,
    service_nf_num: 0,
    service_rnf_num: 0,
    service_ac_num: 0,
    service_abs_num: 0,
    service_absence_reason: "",

    user_email: "",
    user_sub: "",

    setSatellite: (satellite) => set({satellite}),
    setPastoralTeam: (pastoral_team) => set({pastoral_team}),
    setCGLName: (cgl_name) => set({cgl_name}),
    setCGName: (cg_name) => set({cg_name}),
    setDate: (date) => set({date}),
    setTotalMembersNum: (total_members_num) => set({total_members_num}),
    setCGID: (cg_id) => {
        set({cg_id})
        localStorage.setItem("cg_id", cg_id)
    },

    setCGOMNum: (cg_om_num) => {
        if (cg_om_num < 0) set({cg_om_num: 0})
        else set({cg_om_num})
    },
    setCGNBNum: (cg_nb_num) => {
        if (cg_nb_num < 0) set({cg_nb_num: 0})
        else set({cg_nb_num})
    },
    setCGNFNum: (cg_nf_num) => {
        if (cg_nf_num < 0) set({cg_nf_num: 0})
        else set({cg_nf_num})
    },
    setCGRNFNum: (cg_rnf_num) => {
        if (cg_rnf_num < 0) set({cg_rnf_num: 0})
        else set({cg_rnf_num})
    },
    setCGABSNum: (cg_abs_num) => {
        if (cg_abs_num < 0) set({cg_abs_num: 0})
        else set({cg_abs_num})
    },
    setCGACNum: (cg_ac_num) => {
        if (cg_ac_num < 0) set({cg_ac_num: 0})
        else set({cg_ac_num})
    },
    setCGAbsenceReason: (cg_absence_reason) => set({cg_absence_reason}),

    setServiceOMNum: (service_om_num) => {
        if (service_om_num < 0) set({service_om_num: 0})
        else set({service_om_num})
    },
    setServiceNBNum: (service_nb_num) => {
        if (service_nb_num < 0) set({service_nb_num: 0})
        else set({service_nb_num})
    },
    setServiceNFNum: (service_nf_num) => {
        if (service_nf_num < 0) set({service_nf_num: 0})
        else set({service_nf_num})
    },
    setServiceRNFNum: (service_rnf_num) => {
        if (service_rnf_num < 0) set({service_rnf_num: 0})
        else set({service_rnf_num})
    },
    setServiceABSNum: (service_abs_num) => {
        if (service_abs_num < 0) set({service_abs_num: 0})
        else set({service_abs_num})
    },
    setServiceACNum: (service_ac_num) => {
        if (service_ac_num < 0) set({service_ac_num: 0})
        else set({service_ac_num})
    },
    setServiceAbsenceReason: (service_absence_reason) => set({service_absence_reason}),
    setUserEmail: (user_email) => set({user_email}),
    setUserSub: (user_sub) => set({user_sub}),

    initData: async () => {
        const data = await get("CGInfo");
        if (data) {
            set({
                cgl_name: data.cgl_name || "",
                pastoral_team: data.pastoral_team || "",
                satellite: data.satellite || "",
                total_members_num: data.total_members_num || 0,
                cg_name: data.cg_name || "",
                cg_id: data.cg_id || ""
            })
        } else {
            set({
                cgl_name: "",
                pastoral_team: "",
                satellite: "",
                total_members_num: 0,
                cg_name: "",
                cg_id: ""
            })
        }


    },

    reset: () => set({
        satellite: "",
        pastoral_team: "",
        cgl_name: "",
        date: "",
        total_members_num: 0,
        cg_om_num: 0,
        cg_nb_num: 0,
        cg_nf_num: 0,
        cg_rnf_num: 0,
        cg_ac_num: 0,
        cg_abs_num: 0,
        cg_absence_reason: "",
        service_om_num: 0,
        service_nb_num: 0,
        service_nf_num: 0,
        service_rnf_num: 0,
        service_ac_num: 0,
        service_abs_num: 0,
        service_absence_reason: "",
        cg_name: "",
        cg_id: ""
    }),

    resetForm: () => {
        set({
            cg_om_num: "",
            cg_nb_num: "",
            cg_nf_num: "",
            cg_rnf_num: "",
            cg_ac_num: "",
            cg_abs_num: "",
            cg_absence_reason: "",
            service_om_num: "",
            service_nb_num: "",
            service_nf_num: "",
            service_rnf_num: "",
            service_ac_num: "",
            service_abs_num: "",
            service_absence_reason: "",
        })
    },

    // print all values
    printForm: () => {
        console.log(useFormStore.getState())
    },
    getFormData: () => {
        return {
            satellite: useFormStore.getState().satellite,
            pastoral_team: useFormStore.getState().pastoral_team,
            cgl_name: useFormStore.getState().cgl_name,
            date: useFormStore.getState().date,
            total_members_num: useFormStore.getState().total_members_num,
            cg_om_num: useFormStore.getState().cg_om_num,
            cg_nb_num: useFormStore.getState().cg_nb_num,
            cg_nf_num: useFormStore.getState().cg_nf_num,
            cg_rnf_num: useFormStore.getState().cg_rnf_num,
            cg_ac_num: useFormStore.getState().cg_ac_num,
            cg_abs_num: useFormStore.getState().cg_abs_num,
            cg_absence_reason: useFormStore.getState().cg_absence_reason,
            service_om_num: useFormStore.getState().service_om_num,
            service_nb_num: useFormStore.getState().service_nb_num,
            service_nf_num: useFormStore.getState().service_nf_num,
            service_rnf_num: useFormStore.getState().service_rnf_num,
            service_ac_num: useFormStore.getState().service_ac_num,
            service_abs_num: useFormStore.getState().service_abs_num,
            service_absence_reason: useFormStore.getState().service_absence_reason,

            // cg name
            cg_name: useFormStore.getState().cg_name,

            // sub
            user_sub: useFormStore.getState().user_sub,

            // cg id
            cg_id: useFormStore.getState().cg_id
        }
    }
}))
