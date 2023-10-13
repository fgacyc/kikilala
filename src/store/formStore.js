import { create } from 'zustand'

export const useFormStore = create((set) => ({
    satellite:"",
    pastoral_team : "",
    cgl_name : "",
    date:"",
    total_members_num:0,

    // cg activity attendance
    cg_om_num:0,
    cg_nb_num:0,
    cg_nf_num:0,
    cg_rnf_num:0,
    cg_ac_num:0,
    cg_nbs_num:0,
    cg_absence_reason:"",

    // service attendance
    service_om_num:0,
    service_nb_num:0,
    service_nf_num:0,
    service_rnf_num:0,
    service_ac_num:0,
    service_nbs_num:0,
    service_absence_reason:"",

    // add
    cg_name : "",

    setSatellite: (satellite) => set({ satellite }),
    setPastoralTeam: (pastoral_team) => set({ pastoral_team }),
    setCGLName: (cgl_name) => set({ cgl_name }),
    setCGName: (cg_name) => set({ cg_name }),
    setDate: (date) => set({ date }),
    setTotalMembersNum: (total_members_num) => set({ total_members_num }),
    setCGOMNum: (cg_om_num) => set({ cg_om_num }),
    setCGNBNum: (cg_nb_num) => set({ cg_nb_num }),
    setCGNFNum: (cg_nf_num) => set({ cg_nf_num }),
    setCGRNFNum: (cg_rnf_num) => set({ cg_rnf_num }),
    setCGNBSNum: (cg_nbs_num) => set({ cg_nbs_num }),
    setCGACNum: (cg_ac_num) => set({ cg_ac_num }),
    setCGAbsenceReason: (cg_absence_reason) => set({ cg_absence_reason }),
    setServiceOMNum: (service_om_num) => set({ service_om_num }),
    setServiceNBNum: (service_nb_num) => set({ service_nb_num }),
    setServiceNFNum: (service_nf_num) => set({ service_nf_num }),
    setServiceRNFNum: (service_rnf_num) => set({ service_rnf_num }),
    setServiceNBSNum: (service_nbs_num) => set({ service_nbs_num }),
    setServiceACNum: (service_ac_num) => set({ service_ac_num }),
    setServiceAbsenceReason: (service_absence_reason) => set({ service_absence_reason }),

    reset: () => set({
        satellite:"",
        pastoral_team : "",
        cgl_name : "",
        date:"",
        total_members_num:0,
        cg_om_num:0,
        cg_nb_num:0,
        cg_nf_num:0,
        cg_rnf_num:0,
        cg_ac_num:0,
        cg_abs_num:0,
        cg_absence_reason:"",
        service_om_num:0,
        service_nb_num:0,
        service_nf_num:0,
        service_rnf_num:0,
        service_ac_num:0,
        service_abs_num:0,
        service_absence_reason:"",
        cg_name : ""
    }),
    // print all values
    printForm : () => {
        console.log(useFormStore.getState())
    },
    getFormData : () => {
        return {
            satellite: useFormStore.getState().satellite,
            pastoral_team : useFormStore.getState().pastoral_team,
            cgl_name : useFormStore.getState().cgl_name,
            date:useFormStore.getState().date,
            total_members_num:useFormStore.getState().total_members_num,
            cg_om_num:useFormStore.getState().cg_om_num,
            cg_nb_num:useFormStore.getState().cg_nb_num,
            cg_nf_num:useFormStore.getState().cg_nf_num,
            cg_rnf_num:useFormStore.getState().cg_rnf_num,
            cg_ac_num:useFormStore.getState().cg_ac_num,
            cg_nbs_num:useFormStore.getState().cg_nbs_num,
            cg_absence_reason:useFormStore.getState().cg_absence_reason,
            service_om_num:useFormStore.getState().service_om_num,
            service_nb_num:useFormStore.getState().service_nb_num,
            service_nf_num:useFormStore.getState().service_nf_num,
            service_rnf_num:useFormStore.getState().service_rnf_num,
            service_ac_num:useFormStore.getState().service_ac_num,
            service_nbs_num:useFormStore.getState().service_nbs_num,
            service_absence_reason:useFormStore.getState().service_absence_reason,

            // cg name
            cg_name : useFormStore.getState().cg_name
        }
    }
}))
