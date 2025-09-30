import {RegisterMembershipResponse} from "@/services/membership/type";
import {create} from "zustand/index";


interface IStoreTransactionMembership{
    trans: RegisterMembershipResponse['data'] | null;
    setTrans: (data: RegisterMembershipResponse['data'] ) => void,
}

const useStoreTransactionMembership = create<IStoreTransactionMembership>((set) => ({
    trans: null,
    setTrans: (data) => set({trans: data}),
}));

export default useStoreTransactionMembership;