import { create } from 'zustand';

const useSelectedRowStore = create((set) => ({
    selectedRow: null,
    setSelectedRow: (row) => set({ selectedRow: row }),
    clearSelectedRow: () => set({ selectedRow: null }),
}));

export default useSelectedRowStore;
