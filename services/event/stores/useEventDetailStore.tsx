import {EventDetail, EventUserHistory} from "@/services/event/types";
import {create} from "zustand/index";


interface IEventDetailStore {
    event_user_history: EventUserHistory | null,
    event: EventDetail | null,
    setEventUserHistory: (data: EventUserHistory | null) => void,
    setEvent: (data: EventDetail | null) => void,

}

const useEventDetailStore = create<IEventDetailStore>((set) => ({
    event_user_history: null,
    event: null,
    setEventUserHistory: (data) => set({event_user_history: data}),
    setEvent: (data) => set({event: data})

}));

export default useEventDetailStore;
