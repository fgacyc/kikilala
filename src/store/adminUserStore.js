import { create } from 'zustand'
import {Message} from "@arco-design/web-react";

export const useAdminUserStore = create((set) => ({
    name:"",
    email:"",
    remark:"",
    id:"",

    setName: (name) => set({ name }),
    setEmail: (email) => set({ email }),
    setRemark: (remark) => set({ remark }),
    setId: (id) => set({ id }),

    setAdminUser:(adminUser) => set(
        {
            name:adminUser.name,
            email:adminUser.email,
            remark:adminUser.remark,
            id:adminUser.key,
        }
    ),
    validate: () => {
        if(useAdminUserStore.getState().name === ""){
            return false
        }
        if(useAdminUserStore.getState().email === ""){
            return false
        }
        if(useAdminUserStore.getState().remark === ""){
            return false
        }
        return true
    },

    getAdminUser: () => {
        if (!useAdminUserStore.getState().validate()){
            Message.error("Please fill in all the fields.")
            return false
        }
        return {
            name: useAdminUserStore.getState().name,
            email: useAdminUserStore.getState().email,
            remark: useAdminUserStore.getState().remark,
            id: useAdminUserStore.getState().id,
        }
    },
}))
