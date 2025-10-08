import {EventAreaResponse, EventDetail, EventSeatResponse, EventUserHistory} from "@/services/event/types";
import {create} from "zustand/index";


interface IEventDetailStore {
    event_user_history: EventUserHistory | null,
    event: EventDetail | null,
    event_area: EventAreaResponse['data'],
    event_seat: EventSeatResponse['data'],


    setEventSeat: (data: EventSeatResponse['data']) => void,
    setEventArea: (data: EventAreaResponse['data']) => void,
    setEventUserHistory: (data: EventUserHistory | null) => void,
    setEvent: (data: EventDetail | null) => void,

}

const useEventDetailStore = create<IEventDetailStore>((set) => ({
    event_user_history: null,
    event: null,
    event_area: [],
    event_seat: [],


    setEventUserHistory: (data) => set({event_user_history: data}),
    setEvent: (data) => set({event: data}),
    setEventArea: (data) => set({event_area: data}),
    setEventSeat: (data) => set({event_seat: data}),
}));

export default useEventDetailStore;
