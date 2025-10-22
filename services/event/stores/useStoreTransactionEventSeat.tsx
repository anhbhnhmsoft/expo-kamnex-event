import {create} from "zustand";

export type EventSeatTransaction = {
    trans_id: string;
    expired_at: string;
    config_pay: {
        name: string;
        bin: string;
        number: string;
    };
    money: string;
    description: string;
    event_id?: string;
}

interface EventSeatTransactionStore {
    trans: EventSeatTransaction | null;
    setTrans: (trans: EventSeatTransaction | null) => void;
    clearTrans: () => void;
}

const useStoreTransactionEventSeat = create<EventSeatTransactionStore>((set) => ({
    trans: null,
    setTrans: (trans) => set({trans}),
    clearTrans: () => set({trans: null}),
}));

export default useStoreTransactionEventSeat;
