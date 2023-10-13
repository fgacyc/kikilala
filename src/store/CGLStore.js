import { create } from 'zustand'

export const useCGLStore = create((set) => ({
    CG_leader:"",
    CG_name:"",
    pastoral_team:"",
    satellite:"",
    docId : "",

    setCGLeader: (CG_leader) => set({ CG_leader }),
    setCGName: (CG_name) => set({ CG_name }),
    setPastoralTeam: (pastoral_team) => set({ pastoral_team }),
    setSatellite: (satellite) => set({ satellite }),
    setDocId: (docId) => set({ docId }),

    setCGL:(CGL) => set(
        {
            CG_leader:CGL.CG_leader,
            CG_name:CGL.CG_name,
            pastoral_team:CGL.pastoral_team,
            satellite:CGL.satellite,
            docId:CGL.key,
        }
    ),

    reset: () => set({
        CG_leader:"",
        CG_name:"",
        pastoral_team:"",
        satellite:"",
        docId : "",
    }),

    getForm: () => {
        return {
            CG_leader: this.CG_leader,
            CG_name: this.CG_name,
            pastoral_team: this.pastoral_team,
            satellite: this.satellite,
            docId : this.docId,
        }
    }
}))
