import {EventUserHistory} from "@/services/event/types";
import {create} from "zustand/index";


interface IEventDetailStore {
    event_user_history: EventUserHistory | null,
    setEventUserHistory: (data: EventUserHistory | null) => void,
}

const useEventDetailStore = create<IEventDetailStore>((set) => ({
    event_user_history: null,
    setEventUserHistory: (data) => set({event_user_history: data}),
}));

export default useEventDetailStore;
