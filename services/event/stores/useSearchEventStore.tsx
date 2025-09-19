import {create} from "zustand/index";
import {_ActionSearchEvent} from "@/services/event/const";
import {SearchEventParams, SearchEventRequest} from "@/services/event/types";

type LabelSearch = {
    province?: string,
    district?: string,
    ward?: string
}

interface ISearchEventStore {
    request: SearchEventRequest,
    label_search: LabelSearch,
    action: _ActionSearchEvent,
    // functions
    setFilter: (data: SearchEventParams) => void,
    resetFilter: () => void,
    setSortBy: (sort_by: string) => void,
    setAction: (action: _ActionSearchEvent) => void,
    setLabelSearch: (data: LabelSearch) => void,
}

const useSearchEventStore = create<ISearchEventStore>((set) => ({
    request: {
        filters: {},
        sort_by: '',
        page: 1,
        limit: 5,
    },
    action: _ActionSearchEvent.INIT,
    label_search: {
        province: '',
        district: '',
        ward: ''
    },
    // functions
    setFilter: (data) => set((state) => ({request: {...state.request, filters: {...state.request.filters, ...data}}})),
    resetFilter: () => set({request: {filters: {}, page: 1, limit: 10}}),
    setAction: (action) => set({action}),
    setSortBy: (sort_by: string) => set((state) => ({request: {...state.request, sort_by}})),
    setLabelSearch: (data) => set((state) => ({label_search: {...state.label_search, ...data}})),
}));

export default useSearchEventStore;