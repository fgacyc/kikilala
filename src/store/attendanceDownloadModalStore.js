import { create } from 'zustand';

const attendanceDownloadModalStore = create((set) => ({
    selectedRow: null,
    setSelectedRow: (row) => set({ selectedRow: row }),
    clearSelectedRow: () => set({ selectedRow: null }),

    allData : [],
    filteredData : [],

    setAllData: (data) => set({ allData: data }),
    setFilteredData: (data) => set({ filteredData: data }),
}));

export default attendanceDownloadModalStore;
