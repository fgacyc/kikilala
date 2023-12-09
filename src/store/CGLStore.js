import { create } from 'zustand'

export const useCGLStore = create((set) => ({
    CG_leader:"",
    CG_name:"",
    pastoral_team:"",
    satellite:"",
    docId : "",
    nickname: "",
    category: "",
    coach_name: "",

    setCGLeader: (CG_leader) => set({ CG_leader }),
    setCGName: (CG_name) => set({ CG_name }),
    setPastoralTeam: (pastoral_team) => set({ pastoral_team }),
    setSatellite: (satellite) => set({ satellite }),
    setDocId: (docId) => set({ docId }),
    setNickname: (nickname) => set({ nickname }),
    setCategory: (category) => set({ category }),
    setCoachName: (coach_name) => set({ coach_name }),

    setCGL:(CGL) => set(
        {
            CG_leader:CGL.CG_leader,
            CG_name:CGL.CG_name,
            pastoral_team:CGL.pastoral_team,
            satellite:CGL.satellite,
            docId:CGL.key,
            nickname:CGL.nickname,
            category:CGL.category,
            coach_name:CGL.coach_name,
        }
    ),

    reset: () => set({
        CG_leader:"",
        CG_name:"",
        pastoral_team:"",
        satellite:"",
        docId : "",
        nickname: "",
        category: "",
        coach_name: "",
    }),

    getForm: () => {
        return {
            CG_leader: useCGLStore.getState().CG_leader,
            CG_name: useCGLStore.getState().CG_name,
            pastoral_team: useCGLStore.getState().pastoral_team,
            satellite: useCGLStore.getState().satellite,
            docId : useCGLStore.getState().docId,
            nickname: useCGLStore.getState().nickname,
            category: useCGLStore.getState().category,
            coach_name: useCGLStore.getState().coach_name,
        }
    },

    // for coach options
    coachOptions: [],
    setCoachOptions: (coachOptions) => set({ coachOptions }),
}))
